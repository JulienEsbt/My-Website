import {ROUTE_CATALOG} from '../src/config/routeCatalog.js'
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

const manifest = JSON.parse(
    await readFile(path.join(DIST_DIRECTORY, '.vite/manifest.json'), 'utf8')
)
const collectImports = (keys, collected = new Set()) => {
    for (const key of keys) {
        if (collected.has(key)) continue
        const chunk = manifest[key]
        if (!chunk) throw new Error(`Missing build entry: ${key}`)
        collected.add(key)
        collectImports(chunk.imports ?? [], collected)
    }
    return collected
}
const measure = async (keys) => {
    const files = [...new Set([...collectImports(keys)].map((key) => manifest[key].file))]
    const buffers = await Promise.all(
        files
            .filter((file) => file.endsWith('.js'))
            .map((file) => readFile(path.join(DIST_DIRECTORY, file)))
    )
    return {
        raw: buffers.reduce((n, b) => n + b.length, 0),
        gzip: buffers.reduce((n, b) => n + gzipSync(b).length, 0),
    }
}
const initial = await measure(['index.html'])
const initialJavaScript = initial.raw
const initialJavaScriptGzip = initial.gzip

const assetFiles = await listFiles(ASSET_DIRECTORY)
const mediaFiles = await listFilesIfPresent(MEDIA_DIRECTORY)
const failures = []

const enforce = (label, actual, maximum) => {
    if (actual > maximum) failures.push(`${label}: ${formatSize(actual)} > ${formatSize(maximum)}`)
}

enforce('JavaScript initial', initialJavaScript, budgets.initialJavaScript)
enforce('JavaScript initial gzip', initialJavaScriptGzip, budgets.initialJavaScriptGzip)

// Route totals include the application shell, page dependencies and both loaded translation bundles.
for (const route of Object.values(ROUTE_CATALOG)) {
    const keys = ['index.html', `src/pages/${route.page}.jsx`]
    if (route.namespace !== 'common') {
        keys.push(
            `src/i18n/fr/${route.namespace}_fr.json`,
            `src/i18n/en/${route.namespace}_en.json`
        )
    }
    const total = await measure(keys)
    enforce(`Route ${route.path} (imports statiques, gzip)`, total.gzip, 300_000)
    console.log(
        `- Route ${route.path}: ${formatSize(total.raw)} (${formatSize(total.gzip)} gzip, hors modules interactifs à la demande)`
    )
}

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

    // Mapbox 3.30 ships 51.6 kB of vendor CSS; keep the application CSS cap unchanged.
    if (fileName.endsWith('.css'))
        enforce(
            `CSS ${fileName}`,
            size,
            fileName.startsWith('TravelMapbox-') ? 55_000 : budgets.cssChunk
        )
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
