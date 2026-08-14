import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs'
import {extname, relative, resolve} from 'node:path'
import {spawnSync} from 'node:child_process'

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])
const SOURCE_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.mdx', '.ts', '.tsx'])
const SENSITIVE_TAGS = {
    location: /gps/i,
    device: /(make|model|serialnumber|cameraownername)/i,
    attribution: /(artist|author|creator|by-line|copyright|rights|credit|ownername)/i,
}
const rootArgument = process.argv[2]
const strict = process.argv.includes('--strict')

if (!rootArgument) {
    console.error('Usage: node scripts/media-audit.mjs <directory> [--strict]')
    process.exit(2)
}

const projectRoot = process.cwd()
const mediaRoot = resolve(projectRoot, rootArgument)

function walk(directory, predicate = () => true) {
    if (!existsSync(directory)) return []
    return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
        const absolutePath = resolve(directory, entry.name)
        return entry.isDirectory()
            ? walk(absolutePath, predicate)
            : predicate(absolutePath)
              ? [absolutePath]
              : []
    })
}

function formatBytes(bytes) {
    const units = ['o', 'Kio', 'Mio', 'Gio']
    let value = bytes
    let unit = 0
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit += 1
    }
    return `${value.toFixed(unit < 2 ? 0 : 1)} ${units[unit]}`
}

function findReferencedMedia() {
    const sources = walk(resolve(projectRoot, 'src'), (file) =>
        SOURCE_EXTENSIONS.has(extname(file).toLowerCase())
    )
    const references = new Set()
    const patterns = [
        /(?:from\s*|import\s*)['"]([^'"]+\.(?:avif|gif|jpe?g|png|webp))['"]/gi,
        /url\(\s*['"]?([^)'"]+\.(?:avif|gif|jpe?g|png|webp))['"]?\s*\)/gi,
    ]

    for (const source of sources) {
        const content = readFileSync(source, 'utf8')
        for (const pattern of patterns) {
            pattern.lastIndex = 0
            for (const match of content.matchAll(pattern)) {
                if (match[1].startsWith('.')) references.add(resolve(source, '..', match[1]))
            }
        }
    }
    return references
}

const images = walk(mediaRoot, (file) => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()))

if (images.length === 0) {
    console.log(
        `Audit médias : aucun fichier image dans ${relative(projectRoot, mediaRoot) || '.'}.`
    )
    process.exit(0)
}

const exifResult = spawnSync(
    'exiftool',
    [
        '-json',
        '-n',
        '-G1',
        '-GPS:all',
        '-EXIF:Make',
        '-EXIF:Model',
        '-EXIF:SerialNumber',
        '-EXIF:CameraOwnerName',
        '-XMP:Make',
        '-XMP:Model',
        '-XMP:SerialNumber',
        '-XMP:Artist',
        '-XMP:Author',
        '-XMP:Creator',
        '-XMP:Rights',
        '-IPTC:By-line',
        '-IPTC:Credit',
        '-EXIF:Artist',
        '-EXIF:Copyright',
        ...images,
    ],
    {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}
)

if (exifResult.error?.code === 'ENOENT') {
    console.error('ExifTool est requis pour contrôler les métadonnées sensibles.')
    process.exit(2)
}
if (exifResult.status !== 0) {
    console.error('ExifTool n’a pas pu analyser complètement les médias.')
    process.exit(2)
}

const metadata = JSON.parse(exifResult.stdout)
const affected = {location: 0, device: 0, attribution: 0, any: 0}
for (const record of metadata) {
    const keys = Object.keys(record).filter((key) => key !== 'SourceFile')
    const categories = Object.entries(SENSITIVE_TAGS)
        .filter(([, pattern]) => keys.some((key) => pattern.test(key)))
        .map(([category]) => category)
    for (const category of categories) affected[category] += 1
    if (categories.length > 0) affected.any += 1
}

const referencedMedia = findReferencedMedia()
const stats = images.map((file) => ({file, bytes: statSync(file).size}))
const totalBytes = stats.reduce((sum, image) => sum + image.bytes, 0)
const byExtension = Object.fromEntries(
    [...IMAGE_EXTENSIONS]
        .map((extension) => [
            extension.slice(1),
            images.filter((file) => extname(file).toLowerCase() === extension).length,
        ])
        .filter(([, count]) => count > 0)
)

console.log(`Audit médias : ${relative(projectRoot, mediaRoot) || '.'}`)
console.log(`- Images : ${images.length} (${formatBytes(totalBytes)})`)
console.log(
    `- Référencées directement dans le code : ${images.filter((file) => referencedMedia.has(file)).length}`
)
console.log(
    `- Formats : ${Object.entries(byExtension)
        .map(([extension, count]) => `${extension}=${count}`)
        .join(', ')}`
)
console.log(
    `- Plus de 5 Mio : ${stats.filter(({bytes}) => bytes > 5 * 1024 * 1024).length}; plus de 10 Mio : ${stats.filter(({bytes}) => bytes > 10 * 1024 * 1024).length}; plus de 20 Mio : ${stats.filter(({bytes}) => bytes > 20 * 1024 * 1024).length}`
)
console.log(`- Métadonnées GPS : ${affected.location}`)
console.log(`- Métadonnées d’appareil : ${affected.device}`)
console.log(`- Métadonnées d’auteur/propriétaire : ${affected.attribution}`)
console.log(`- Au moins une catégorie sensible : ${affected.any}`)
console.log('- Les valeurs privées et les noms de fichiers concernés ne sont jamais affichés.')

if (strict && affected.any > 0) {
    console.error(
        `Contrôle refusé : ${affected.any} image(s) contiennent encore des métadonnées sensibles.`
    )
    process.exit(1)
}
