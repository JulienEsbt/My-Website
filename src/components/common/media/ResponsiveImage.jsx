import React from 'react'
import './ResponsiveImage.css'

function buildSourceSet(variants) {
    return variants
        .sort((a, b) => a.width - b.width)
        .map((variant) => `${variant.url} ${variant.width}w`)
        .join(', ')
}

export default function ResponsiveImage({
    media,
    alt,
    sizes = '100vw',
    loading = 'lazy',
    decoding = 'async',
    fetchPriority,
    className,
    ...imageProps
}) {
    const priorityProps = fetchPriority ? {fetchpriority: fetchPriority} : {}

    if (!media?.variants) {
        return (
            <img
                src={media}
                alt={alt}
                loading={loading}
                decoding={decoding}
                className={className}
                {...priorityProps}
                {...imageProps}
            />
        )
    }

    const byFormat = media.variants.reduce((groups, variant) => {
        groups[variant.format] ??= []
        groups[variant.format].push(variant)
        return groups
    }, {})
    const fallbacks = [...(byFormat.fallback ?? [])].sort((a, b) => a.width - b.width)
    const fallback = fallbacks.at(-1) ?? media.variants.at(-1)

    return (
        <picture className="responsive-picture">
            {byFormat.avif?.length > 0 && (
                <source
                    type="image/avif"
                    srcSet={buildSourceSet([...byFormat.avif])}
                    sizes={sizes}
                />
            )}
            {byFormat.webp?.length > 0 && (
                <source
                    type="image/webp"
                    srcSet={buildSourceSet([...byFormat.webp])}
                    sizes={sizes}
                />
            )}
            <img
                src={fallback.url}
                srcSet={buildSourceSet(fallbacks)}
                sizes={sizes}
                width={fallback.width}
                height={fallback.height}
                alt={alt}
                loading={loading}
                decoding={decoding}
                className={className}
                {...priorityProps}
                {...imageProps}
            />
        </picture>
    )
}
