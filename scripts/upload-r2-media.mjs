import {spawn} from 'node:child_process'
import {readFileSync, statSync} from 'node:fs'
import {extname, resolve} from 'node:path'
import process from 'node:process'
import {createInterface} from 'node:readline/promises'

const projectRoot = resolve(import.meta.dirname, '..')
const bucketName = 'julien-esterbet-media'
const publicBaseUrl = 'https://pub-35a1591bfd784e15bae49fe6349d16d0.r2.dev'
const defaultAlbum = 'saint-barth-2023'
const uploadConcurrency = 8
const verificationConcurrency = 4
const verificationAttempts = 8

function readHidden(label) {
    if (!process.stdin.isTTY) {
        throw new Error('Cette commande doit être lancée dans un terminal interactif.')
    }

    process.stdout.write(label)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    return new Promise((resolveValue, reject) => {
        let value = ''

        function cleanup() {
            process.stdin.off('data', onData)
            process.stdin.setRawMode(false)
            process.stdin.pause()
            process.stdout.write('\n')
        }

        function onData(character) {
            if (character === '\u0003') {
                cleanup()
                reject(new Error('Envoi annulé.'))
                return
            }

            if (character === '\r' || character === '\n') {
                cleanup()
                resolveValue(value)
                return
            }

            if (character === '\u007f' || character === '\b') {
                value = value.slice(0, -1)
                return
            }

            value += character
        }

        process.stdin.on('data', onData)
    })
}

function contentTypeFor(filePath) {
    return (
        {
            '.avif': 'image/avif',
            '.jpg': 'image/jpeg',
            '.webp': 'image/webp',
        }[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
    )
}

function curlWithCredentials(args, accessKey, secretKey) {
    const credentials = `${accessKey}:${secretKey}`.replaceAll('\\', '\\\\').replaceAll('"', '\\"')

    return new Promise((resolveValue, reject) => {
        const child = spawn('curl', ['--config', '-', ...args], {
            stdio: ['pipe', 'ignore', 'pipe'],
        })
        let stderr = ''

        child.stderr.setEncoding('utf8')
        child.stderr.on('data', (chunk) => {
            stderr += chunk
        })
        child.on('error', reject)
        child.on('close', (code) => {
            if (code === 0) {
                resolveValue()
                return
            }
            reject(new Error(stderr.trim() || `curl a quitté avec le code ${code}.`))
        })
        child.stdin.end(`user = "${credentials}"\n`)
    })
}

async function mapWithConcurrency(items, concurrency, worker) {
    let currentIndex = 0

    async function runNext() {
        while (currentIndex < items.length) {
            const itemIndex = currentIndex
            currentIndex += 1
            await worker(items[itemIndex], itemIndex)
        }
    }

    await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, () => runNext()))
}

function wait(delay) {
    return new Promise((resolveValue) => setTimeout(resolveValue, delay))
}

async function publicObjectMatches(media) {
    const expectedLength = statSync(media.path).size

    for (let attempt = 1; attempt <= verificationAttempts; attempt += 1) {
        try {
            const response = await fetch(`${publicBaseUrl}/${media.key}`, {
                method: 'HEAD',
                signal: AbortSignal.timeout(15_000),
            })
            const contentLength = Number(response.headers.get('content-length'))

            if (response.ok && contentLength === expectedLength) return true
            if (response.status === 404) return false
        } catch {
            // The public r2.dev endpoint is rate-limited; retry transient network failures.
        }

        await wait(Math.min(250 * 2 ** (attempt - 1), 4_000))
    }

    return false
}

const requestedScope = process.argv[2] ?? defaultAlbum
const uploadAll = requestedScope === '--all'
const verifyOnly = requestedScope === '--verify-only'
const manifestPath = uploadAll
    ? resolve(projectRoot, 'src/generated/mediaManifest.json')
    : verifyOnly
      ? resolve(projectRoot, 'src/generated/mediaManifest.json')
      : resolve(projectRoot, 'src/generated/media/travels', `${requestedScope}.json`)
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const mediaUrls = [...new Set(manifest.flatMap((media) => media.variants.map(({url}) => url)))]
const mediaFiles = mediaUrls.map((url) => ({
    url,
    key: url.replace(/^\//, ''),
    path: resolve(projectRoot, 'public', url.replace(/^\//, '')),
}))
const totalBytes = mediaFiles.reduce((sum, media) => sum + statSync(media.path).size, 0)

console.log(
    `${uploadAll ? 'Migration complète' : verifyOnly ? 'Vérification complète' : `Pilote ${requestedScope}`} : ${manifest.length} sources, ${mediaFiles.length} fichiers, ${(totalBytes / 1024 / 1024).toFixed(1)} Mio.`
)

if (!verifyOnly) {
    const terminal = createInterface({input: process.stdin, output: process.stdout})
    const endpointInput = await terminal.question(
        'Endpoint S3 R2 (https://<ACCOUNT_ID>.r2.cloudflarestorage.com) : '
    )
    terminal.close()

    const accessKey = await readHidden('Access Key ID (masqué) : ')
    const secretKey = await readHidden('Secret Access Key (masqué) : ')
    const endpoint = endpointInput.trim().replace(/\/+$/, '')

    if (!/^https:\/\/[a-z0-9]+\.r2\.cloudflarestorage\.com$/i.test(endpoint)) {
        throw new Error('Endpoint R2 invalide.')
    }
    if (!accessKey || !secretKey) {
        throw new Error('Les identifiants R2 sont requis.')
    }

    let inventoried = 0
    let alreadyPresent = 0
    const filesToUpload = []
    await mapWithConcurrency(mediaFiles, verificationConcurrency, async (media) => {
        if (await publicObjectMatches(media)) {
            alreadyPresent += 1
        } else {
            filesToUpload.push(media)
        }
        inventoried += 1
        process.stdout.write(`\rInventaire R2 : ${inventoried}/${mediaFiles.length}`)
    })
    process.stdout.write('\n')
    console.log(`${alreadyPresent} fichier(s) déjà valide(s), ${filesToUpload.length} à envoyer.`)

    let uploaded = 0
    await mapWithConcurrency(filesToUpload, uploadConcurrency, async (media) => {
        await curlWithCredentials(
            [
                '--fail',
                '--silent',
                '--show-error',
                '--aws-sigv4',
                'aws:amz:auto:s3',
                '--header',
                `Content-Type: ${contentTypeFor(media.path)}`,
                '--header',
                'Cache-Control: public, max-age=31536000, immutable',
                '--upload-file',
                media.path,
                `${endpoint}/${bucketName}/${media.key}`,
            ],
            accessKey,
            secretKey
        )
        uploaded += 1
        process.stdout.write(`\rEnvoi : ${uploaded}/${filesToUpload.length}`)
    })
    process.stdout.write('\n')
}

let verified = 0
const failures = []
await mapWithConcurrency(mediaFiles, verificationConcurrency, async (media) => {
    if (!(await publicObjectMatches(media))) {
        failures.push(media.key)
    } else {
        verified += 1
    }
    process.stdout.write(
        `\rVérification publique : ${verified + failures.length}/${mediaFiles.length}`
    )
})
process.stdout.write('\n')

if (failures.length > 0) {
    console.error(`Échec de vérification pour ${failures.length} fichier(s) :`)
    for (const key of failures.slice(0, 20)) console.error(`- ${key}`)
    process.exitCode = 1
} else {
    console.log(`Vérification réussie : ${verified}/${mediaFiles.length} fichiers.`)
}

console.log(
    `${uploadAll || verifyOnly ? 'Médias disponibles' : 'Pilote disponible'} : ${publicBaseUrl}/media/`
)
