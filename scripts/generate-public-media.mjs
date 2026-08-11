import {createHash} from 'node:crypto'
import {mkdir, readdir, rm, stat, writeFile} from 'node:fs/promises'
import {basename, extname, relative, resolve, sep} from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const sourceRoot = resolve(projectRoot, 'src/assets/images')
const outputRoot = resolve(projectRoot, 'public/media')
const manifestPath = resolve(projectRoot, '.media-manifest.json')
const imageExtensions = new Set(['.jpeg', '.jpg', '.png'])
const concurrency = 4
const profiles = {
    hero: {widths: [480, 768, 1024], fit: 'cover'},
    content: {widths: [480, 768, 1024], fit: 'inside'},
    project: {widths: [480, 800, 1200], fit: 'inside'},
    gallery: {widths: [320, 960, 1920], fit: 'inside'},
    web3: {widths: [480, 800, 1200], fit: 'inside'},
}

async function walk(directory) {
    const entries = await readdir(directory, {withFileTypes: true})
    const children = await Promise.all(
        entries.map((entry) => {
            const path = resolve(directory, entry.name)
            return entry.isDirectory() ? walk(path) : [path]
        }),
    )
    return children.flat()
}

function getProfile(relativePath) {
    if (relativePath.startsWith(`travels${sep}`)) return 'gallery'
    if (relativePath.startsWith(`web3${sep}`)) return 'web3'
    if (relativePath.includes(`${sep}header${sep}`)) return 'hero'
    if (relativePath.includes(`${sep}portfolio${sep}`)) return 'project'
    return 'content'
}

function publicId(relativePath) {
    const name = basename(relativePath, extname(relativePath))
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
        .slice(0, 40)
    const hash = createHash('sha256').update(relativePath).digest('hex').slice(0, 12)
    return `${name || 'image'}-${hash}`
}

function publicUrl(path) {
    return `/${relative(resolve(projectRoot, 'public'), path).split(sep).join('/')}`
}

async function generateImage(source) {
    const relativeSource = relative(sourceRoot, source)
    const profileName = getProfile(relativeSource)
    const profile = profiles[profileName]
    const metadata = await sharp(source).metadata()
    const sourceBytes = (await stat(source)).size
    const widths = profile.widths.filter((width) => width <= metadata.width)
    if (widths.length === 0) widths.push(metadata.width)
    const uniqueWidths = [...new Set(widths)]
    const preserveTransparency = Boolean(metadata.hasAlpha)
    const directory = resolve(outputRoot, profileName, publicId(relativeSource))
    await mkdir(directory, {recursive: true})

    const variants = []
    for (const width of uniqueWidths) {
        const base = sharp(source)
            .rotate()
            .resize({width, withoutEnlargement: true, fit: profile.fit})
        const formats = [
            {format: 'avif', extension: 'avif', pipeline: base.clone().avif({quality: 60, effort: 4})},
            {format: 'webp', extension: 'webp', pipeline: base.clone().webp({quality: 78, effort: 4})},
            preserveTransparency
                ? {format: 'fallback', extension: 'png', pipeline: base.clone().png({compressionLevel: 9})}
                : {format: 'fallback', extension: 'jpg', pipeline: base.clone().jpeg({quality: 82, mozjpeg: true})},
        ]

        for (const outputFormat of formats) {
            const output = resolve(directory, `${width}.${outputFormat.extension}`)
            await outputFormat.pipeline.toFile(output)
            const generatedMetadata = await sharp(output).metadata()
            variants.push({
                format: outputFormat.format,
                url: publicUrl(output),
                width: generatedMetadata.width,
                height: generatedMetadata.height,
                bytes: (await stat(output)).size,
            })
        }
    }

    return {
        source: relative(projectRoot, source),
        profile: profileName,
        sourceWidth: metadata.width,
        sourceHeight: metadata.height,
        sourceBytes,
        variants,
    }
}

async function mapWithConcurrency(items, worker, limit) {
    const results = new Array(items.length)
    let nextIndex = 0
    async function run() {
        while (nextIndex < items.length) {
            const index = nextIndex
            nextIndex += 1
            results[index] = await worker(items[index])
            if ((index + 1) % 50 === 0 || index + 1 === items.length) {
                console.log(`${index + 1}/${items.length} sources traitées`)
            }
        }
    }
    await Promise.all(Array.from({length: Math.min(limit, items.length)}, run))
    return results
}

const sources = (await walk(sourceRoot))
    .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
    .sort()

await rm(outputRoot, {recursive: true, force: true})
await mkdir(outputRoot, {recursive: true})

const generated = await mapWithConcurrency(sources, generateImage, concurrency)
await writeFile(manifestPath, `${JSON.stringify(generated, null, 2)}\n`)

const sourceBytes = generated.reduce((sum, image) => sum + image.sourceBytes, 0)
const outputBytes = generated.reduce(
    (sum, image) => sum + image.variants.reduce((variantSum, variant) => variantSum + variant.bytes, 0),
    0,
)
const variantCount = generated.reduce((sum, image) => sum + image.variants.length, 0)

console.log(`Génération terminée : ${generated.length} sources, ${variantCount} dérivés.`)
console.log(`Sources : ${(sourceBytes / 1024 / 1024 / 1024).toFixed(2)} Gio.`)
console.log(`Dérivés : ${(outputBytes / 1024 / 1024).toFixed(1)} Mio.`)
console.log(`Manifest local : ${relative(projectRoot, manifestPath)}.`)
