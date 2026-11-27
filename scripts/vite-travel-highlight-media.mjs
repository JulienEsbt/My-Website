import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const highlights = [
    ['portugal-2025', 'IMG_1949.jpeg', '50% 55%'],
    ['guadeloupe-2025', 'IMG_1682.jpeg', '50% 66%'],
    ['italy-2023', 'IMG_8723.jpeg', '50% 48%'],
    ['austria-2023', 'IMG_2908.jpeg', '50% 52%'],
    ['saint-martin-2023', 'IMG_1808.jpeg', '50% 55%'],
    ['estonia-2022', 'IMG_2043.jpeg', '50% 55%'],
]

export default function travelHighlightMedia() {
    const moduleName = 'virtual:travel-highlight-media'
    const moduleId = `\0${moduleName}`

    return {
        name: 'travel-highlight-media',
        resolveId(id) {
            return id === moduleName ? moduleId : null
        },
        async load(id) {
            if (id !== moduleId) return null

            // Only send the six covers to the carousel. Galleries still use the full manifests.
            const covers = await Promise.all(
                highlights.map(async ([tripId, filename, photoPosition]) => {
                    const path = fileURLToPath(
                        new URL(`../src/generated/media/travels/${tripId}.json`, import.meta.url)
                    )
                    this.addWatchFile(path)
                    const entries = JSON.parse(await readFile(path, 'utf8'))
                    const relativeSource = `${tripId}/${filename}`
                    const media = entries.find(
                        ({source}) => source === `src/assets/images/travels/${relativeSource}`
                    )
                    if (!media) throw new Error(`Missing travel highlight media: ${relativeSource}`)
                    return {tripId, relativeSource, photoPosition, media}
                })
            )

            return `export default ${JSON.stringify(covers)}`
        },
    }
}
