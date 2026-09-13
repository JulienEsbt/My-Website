import {readdir, readFile} from 'node:fs/promises'
import {join} from 'node:path'
import sharp from 'sharp'
import {loadEnv} from 'vite'

async function filesIn(directory) {
    return (
        await Promise.all(
            (await readdir(directory, {withFileTypes: true})).map((entry) =>
                entry.isDirectory()
                    ? filesIn(join(directory, entry.name))
                    : join(directory, entry.name)
            )
        )
    ).flat()
}
const files = (await filesIn('src/generated/media')).filter(
    (file) => file.endsWith('.json') && file !== 'src/generated/media/travels.json'
)
const seenSources = new Set()
const seenUrls = new Set()
const samples = []
let variants = 0
for (const file of files) {
    const entries = JSON.parse(await readFile(file, 'utf8'))
    if (!Array.isArray(entries) || !entries.length) throw new Error(`Empty media manifest: ${file}`)
    for (const media of entries) {
        if (!media.source?.startsWith('src/assets/images/') || seenSources.has(media.source))
            throw new Error(`Invalid or duplicate source in ${file}`)
        seenSources.add(media.source)
        if (!media.variants?.length) throw new Error(`Missing variants in ${file}`)
        for (const variant of media.variants) {
            if (
                !/^\/media\/[a-z0-9/_-]+\.(avif|webp|jpe?g|png)$/.test(variant.url) ||
                !Number.isInteger(variant.width) ||
                !Number.isInteger(variant.height) ||
                variant.width < 1 ||
                variant.height < 1 ||
                seenUrls.has(variant.url)
            )
                throw new Error(`Invalid or duplicate variant in ${file}`)
            seenUrls.add(variant.url)
            variants += 1
        }
    }
    // Deterministic coverage of each album and encoded format, without fetching entire albums.
    for (const format of ['avif', 'webp', 'fallback']) {
        const variant = entries[0].variants.find((item) => item.format === format)
        if (!variant) throw new Error(`Missing ${format} variant in ${file}`)
        samples.push(variant)
    }
}
console.log(
    `Media manifests: ${files.length} files, ${seenSources.size} sources, ${variants} variants validated.`
)
if (process.argv.includes('--remote')) {
    const env = {...loadEnv('production', process.cwd(), ''), ...process.env}
    const base = env.VITE_MEDIA_BASE_URL
    if (!base || new URL(base).protocol !== 'https:')
        throw new Error('VITE_MEDIA_BASE_URL must identify the public HTTPS media origin.')
    let index = 0
    await Promise.all(
        Array.from({length: 4}, async () => {
            while (index < samples.length) {
                const variant = samples[index++]
                const response = await fetch(`${base.replace(/\/$/, '')}${variant.url}`, {
                    signal: AbortSignal.timeout(15000),
                })
                if (!response.ok)
                    throw new Error(`Public media returned HTTP ${response.status}: ${variant.url}`)
                const buffer = Buffer.from(await response.arrayBuffer())
                if (buffer.length > 1_750_000)
                    throw new Error('Public media sample exceeds the file budget.')
                const metadata = await sharp(buffer).metadata()
                if (metadata.exif || metadata.iptc || metadata.xmp)
                    throw new Error(
                        'Public media sample contains embedded metadata; private values are not displayed.'
                    )
                if (metadata.width !== variant.width || metadata.height !== variant.height)
                    throw new Error(`Public dimensions differ from manifest: ${variant.url}`)
            }
        })
    )
    console.log(
        `Public media: ${samples.length} deterministic samples verified (availability, size, dimensions, metadata). This is a sample, not an exhaustive audit.`
    )
}
