import {mkdir, readdir, rm, stat, writeFile} from 'node:fs/promises'
import {extname, relative, resolve} from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const outputRoot = resolve(projectRoot, '.media-prototype')
const travelRoot = resolve(projectRoot, 'src/assets/images/travels')
const imageExtensions = new Set(['.jpeg', '.jpg', '.png'])

const useCases = {
    hero: {widths: [480, 768, 1024], fit: 'cover'},
    content: {widths: [480, 768, 1024], fit: 'inside'},
    project: {widths: [480, 800, 1200], fit: 'inside'},
    gallery: {widths: [320, 640, 960], fit: 'inside'},
    lightbox: {widths: [640, 1280, 1920], fit: 'inside'},
}

async function walk(directory) {
    const entries = await readdir(directory, {withFileTypes: true})
    const nested = await Promise.all(
        entries.map((entry) => {
            const path = resolve(directory, entry.name)
            return entry.isDirectory() ? walk(path) : [path]
        }),
    )
    return nested.flat()
}

function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Kio`
    return `${(bytes / 1024 / 1024).toFixed(1)} Mio`
}

async function selectSamples() {
    const travelImages = (
        await Promise.all(
            (await walk(travelRoot))
                .filter((file) => imageExtensions.has(extname(file).toLowerCase()))
                .map(async (file) => ({file, bytes: (await stat(file)).size})),
        )
    ).sort((a, b) => a.bytes - b.bytes)

    return [
        {
            id: 'home-hero',
            source: resolve(projectRoot, 'src/assets/images/home/header/Me.jpeg'),
            useCase: 'hero',
        },
        {
            id: 'home-about',
            source: resolve(
                projectRoot,
                'src/assets/images/home/about/D14F4D37-8AEF-4E9D-8CAE-DEDE412C2D64_1_105_c.jpeg',
            ),
            useCase: 'content',
        },
        {
            id: 'project-preview',
            source: resolve(projectRoot, 'src/assets/images/home/portfolio/Megalis.png'),
            useCase: 'project',
            preserveTransparency: true,
        },
        {
            id: 'travel-gallery',
            source: travelImages[Math.floor(travelImages.length / 2)].file,
            useCase: 'gallery',
        },
        {
            id: 'travel-lightbox',
            source: travelImages.at(-1).file,
            useCase: 'lightbox',
        },
    ]
}

async function createTile(input, label) {
    const image = await sharp(input)
        .rotate()
        .resize(300, 180, {fit: 'contain', background: '#050814'})
        .flatten({background: '#050814'})
        .jpeg({quality: 88})
        .toBuffer()
    const escapedLabel = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    const caption = Buffer.from(
        `<svg width="300" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="40" fill="#10182b"/><text x="12" y="25" fill="#e7eefc" font-family="Arial, sans-serif" font-size="13">${escapedLabel}</text></svg>`,
    )
    return sharp({create: {width: 300, height: 220, channels: 3, background: '#050814'}})
        .composite([
            {input: image, top: 0, left: 0},
            {input: caption, top: 180, left: 0},
        ])
        .jpeg({quality: 88})
        .toBuffer()
}

await rm(outputRoot, {recursive: true, force: true})
await mkdir(outputRoot, {recursive: true})

const samples = await selectSamples()
const manifest = []
const rows = []

for (const sample of samples) {
    const sourceMetadata = await sharp(sample.source).metadata()
    const sourceBytes = (await stat(sample.source)).size
    const sampleDirectory = resolve(outputRoot, sample.id)
    await mkdir(sampleDirectory, {recursive: true})
    const widths = useCases[sample.useCase].widths.filter((width) => width <= sourceMetadata.width)
    if (widths.length === 0) widths.push(sourceMetadata.width)

    const outputs = []
    for (const width of [...new Set(widths)]) {
        const base = sharp(sample.source)
            .rotate()
            .resize({width, withoutEnlargement: true, fit: useCases[sample.useCase].fit})
        const formats = [
            {name: 'avif', extension: 'avif', pipeline: base.clone().avif({quality: 60, effort: 4})},
            {name: 'webp', extension: 'webp', pipeline: base.clone().webp({quality: 78, effort: 4})},
            sample.preserveTransparency
                ? {name: 'fallback', extension: 'png', pipeline: base.clone().png({compressionLevel: 9})}
                : {name: 'fallback', extension: 'jpg', pipeline: base.clone().jpeg({quality: 82, mozjpeg: true})},
        ]

        for (const format of formats) {
            const output = resolve(sampleDirectory, `${width}.${format.extension}`)
            await format.pipeline.toFile(output)
            const outputMetadata = await sharp(output).metadata()
            outputs.push({
                format: format.name,
                path: relative(projectRoot, output),
                width: outputMetadata.width,
                height: outputMetadata.height,
                bytes: (await stat(output)).size,
            })
        }
    }

    const previewWidth = widths.reduce((best, width) =>
        Math.abs(width - 640) < Math.abs(best - 640) ? width : best,
    )
    const previews = ['avif', 'webp', 'fallback'].map((format) =>
        outputs.find((output) => output.width === previewWidth && output.format === format),
    )
    rows.push(
        await Promise.all([
            createTile(sample.source, `${sample.id} · source · ${formatBytes(sourceBytes)}`),
            ...previews.map((preview) =>
                createTile(resolve(projectRoot, preview.path), `${preview.format} · ${preview.width}px · ${formatBytes(preview.bytes)}`),
            ),
        ]),
    )
    manifest.push({
        id: sample.id,
        useCase: sample.useCase,
        source: relative(projectRoot, sample.source),
        sourceWidth: sourceMetadata.width,
        sourceHeight: sourceMetadata.height,
        sourceBytes,
        outputs,
    })
}

const tileWidth = 300
const tileHeight = 220
await sharp({
    create: {
        width: tileWidth * 4,
        height: tileHeight * rows.length,
        channels: 3,
        background: '#050814',
    },
})
    .composite(
        rows.flatMap((row, rowIndex) =>
            row.map((input, columnIndex) => ({
                input,
                top: rowIndex * tileHeight,
                left: columnIndex * tileWidth,
            })),
        ),
    )
    .jpeg({quality: 90})
    .toFile(resolve(outputRoot, 'comparison-sheet.jpg'))

await writeFile(resolve(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

const sourceTotal = manifest.reduce((sum, sample) => sum + sample.sourceBytes, 0)
for (const format of ['avif', 'webp', 'fallback']) {
    const comparableTotal = manifest.reduce((sum, sample) => {
        const largest = sample.outputs.filter((output) => output.format === format).at(-1)
        return sum + largest.bytes
    }, 0)
    console.log(`${format}: ${formatBytes(comparableTotal)} contre ${formatBytes(sourceTotal)} pour les 5 sources`)
}
console.log(`Prototype généré dans ${relative(projectRoot, outputRoot)} avec ${manifest.reduce((sum, sample) => sum + sample.outputs.length, 0)} dérivés.`)
