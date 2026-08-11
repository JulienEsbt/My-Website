import mediaManifest from '../generated/mediaManifest.json'

const mediaBySource = new Map(mediaManifest.map((media) => [media.source, media]))

export function getMedia(relativeSource) {
    const source = `src/assets/images/${relativeSource}`
    const media = mediaBySource.get(source)

    if (!media) {
        throw new Error(`Média généré introuvable pour ${relativeSource}`)
    }

    return {
        ...media,
        id: relativeSource,
    }
}
