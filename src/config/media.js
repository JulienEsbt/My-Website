export function createMediaResolver(manifest, domain) {
    const mediaBySource = new Map(manifest.map((media) => [media.source, media]))

    return (relativeSource) => {
        const source = `src/assets/images/${domain}/${relativeSource}`
        const media = mediaBySource.get(source)

        if (!media) {
            throw new Error(`Média généré introuvable pour ${domain}/${relativeSource}`)
        }

        return {
            ...media,
            id: `${domain}/${relativeSource}`,
        }
    }
}
