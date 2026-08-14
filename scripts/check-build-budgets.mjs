import {gzipSync} from 'node:zlib'
import {readdir, readFile, stat} from 'node:fs/promises'
import path from 'node:path'

const DIST_DIRECTORY = path.resolve('dist')
const ASSET_DIRECTORY = path.join(DIST_DIRECTORY, 'assets')
const MEDIA_DIRECTORY = path.resolve('public/media')

const budgets = Object.freeze({
    initialJavaScript: 575_000,
    initialJavaScriptGzip: 200_000,
    standardJavaScriptChunk: 450_000,
    heavyInteractiveChunk: 1_900_000,
    cssChunk: 50_000,
    mediaFile: 1_750_000,
})

const formatSize = (bytes) => `${(bytes / 1024).toFixed(1)} Kio`

const listFiles = async (directory) => {
    const entries = await readdir(directory, {withFileTypes: true})
    const nestedFiles = await Promise.all(
        entries.map((entry) => {
            const entryPath = path.join(directory, entry.name)
            return entry.isDirectory() ? listFiles(entryPath) : [entryPath]
        })
    )
    return nestedFiles.flat()
}

const listFilesIfPresent = async (directory) => {
    try {
        return await listFiles(directory)
    } catch (error) {
        if (error?.code === 'ENOENT') return []
        throw error
    }
}

const isHeavyInteractiveChunk = (fileName) =>
    fileName.startsWith('TravelMapbox-') || fileName.startsWith('TravelGlobe-')

const indexHtml = await readFile(path.join(DIST_DIRECTORY, 'index.html'), 'utf8')
const initialAssetPaths = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map(
    (match) => path.join(DIST_DIRECTORY, match[1])
)
const initialBuffers = await Promise.all(initialAssetPaths.map((assetPath) => readFile(assetPath)))
const initialJavaScript = initialBuffers.reduce((total, buffer) => total + buffer.length, 0)
const initialJavaScriptGzip = initialBuffers.reduce(
    (total, buffer) => total + gzipSync(buffer).length,
    0
)

const assetFiles = await listFiles(ASSET_DIRECTORY)
const mediaFiles = await listFilesIfPresent(MEDIA_DIRECTORY)
const failures = []

const enforce = (label, actual, maximum) => {
    if (actual > maximum) failures.push(`${label}: ${formatSize(actual)} > ${formatSize(maximum)}`)
}

enforce('JavaScript initial', initialJavaScript, budgets.initialJavaScript)
enforce('JavaScript initial gzip', initialJavaScriptGzip, budgets.initialJavaScriptGzip)

for (const assetPath of assetFiles) {
    const fileName = path.basename(assetPath)
    const size = (await stat(assetPath)).size

    if (fileName.endsWith('.js')) {
        enforce(
            `Chunk ${fileName}`,
            size,
            isHeavyInteractiveChunk(fileName)
                ? budgets.heavyInteractiveChunk
                : budgets.standardJavaScriptChunk
        )
    }

    if (fileName.endsWith('.css')) enforce(`CSS ${fileName}`, size, budgets.cssChunk)
}

let largestMediaFile = {path: '', size: 0}
for (const mediaPath of mediaFiles) {
    const size = (await stat(mediaPath)).size
    if (size > largestMediaFile.size) largestMediaFile = {path: mediaPath, size}
}
if (mediaFiles.length > 0) {
    enforce(
        `Média ${path.relative(MEDIA_DIRECTORY, largestMediaFile.path)}`,
        largestMediaFile.size,
        budgets.mediaFile
    )
}

console.log('Budgets de performance :')
console.log(
    `- JavaScript initial : ${formatSize(initialJavaScript)} (${formatSize(initialJavaScriptGzip)} gzip)`
)
console.log(
    mediaFiles.length > 0
        ? `- Plus gros média : ${formatSize(largestMediaFile.size)}`
        : '- Médias locaux : contrôle ignoré (dossier absent de cet environnement)'
)
console.log(`- Limite chunk JS standard : ${formatSize(budgets.standardJavaScriptChunk)}`)
console.log(`- Limite CSS : ${formatSize(budgets.cssChunk)}`)

if (failures.length > 0) {
    console.error('\nBudgets dépassés :')
    failures.forEach((failure) => console.error(`- ${failure}`))
    process.exitCode = 1
} else {
    console.log('- Tous les budgets sont respectés.')
}
