const DEFAULT_MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL ?? ''

export function resolveMediaUrl(url, baseUrl = DEFAULT_MEDIA_BASE_URL) {
    if (!baseUrl || !url?.startsWith('/media/')) return url

    try {
        const normalizedBase = new URL(baseUrl)
        if (
            normalizedBase.protocol !== 'https:' ||
            normalizedBase.username ||
            normalizedBase.password
        )
            return url

        return `${normalizedBase.origin}${normalizedBase.pathname.replace(/\/$/, '')}${url}`
    } catch {
        return url
    }
}

export function createMediaResolver(manifest, domain, mediaBaseUrl = DEFAULT_MEDIA_BASE_URL) {
    const mediaBySource = new Map(manifest.map((media) => [media.source, media]))

    return (relativeSource) => {
        const source = `src/assets/images/${domain}/${relativeSource}`
        const media = mediaBySource.get(source)

        if (!media) {
            throw new Error(`Média généré introuvable pour ${domain}/${relativeSource}`)
        }

        return {
            ...media,
            variants: media.variants.map((variant) => ({
                ...variant,
                url: resolveMediaUrl(variant.url, mediaBaseUrl),
            })),
            id: `${domain}/${relativeSource}`,
        }
    }
}
