import React from 'react'
import './CountryFlag.css'

const CountryFlag = ({code, label = '', className = '', decorative = true}) => {
    const normalizedCode = code?.toLowerCase() || 'world'

    return (
        <img
            className={`country-flag ${className}`.trim()}
            src={`/emoji-flags/${normalizedCode}.${['fr', 'gb'].includes(normalizedCode) ? 'webp' : 'png'}`}
            alt={decorative ? '' : label}
            aria-hidden={decorative ? 'true' : undefined}
            loading="lazy"
            decoding="async"
        />
    )
}

export default CountryFlag
