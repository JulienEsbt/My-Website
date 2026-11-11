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

    // Set sizes before srcSet so WebKit selects the right candidate on first insertion.
    return (
        <picture className="responsive-picture">
            {byFormat.avif?.length > 0 && (
                <source
                    type="image/avif"
                    sizes={sizes}
                    srcSet={buildSourceSet([...byFormat.avif])}
                />
            )}
            {byFormat.webp?.length > 0 && (
                <source
                    type="image/webp"
                    sizes={sizes}
                    srcSet={buildSourceSet([...byFormat.webp])}
                />
            )}
            <img
                sizes={sizes}
                srcSet={buildSourceSet(fallbacks)}
                src={fallback.url}
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
