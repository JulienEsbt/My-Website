import React from 'react'
import './CountryFlag.css'

const CountryFlag = ({code, label = '', className = '', decorative = true}) => {
    const normalizedCode = code?.toLowerCase()

    if (!normalizedCode) {
        return (
            <span
                className={`country-flag country-flag--fallback ${className}`.trim()}
                aria-hidden={decorative ? 'true' : undefined}
                aria-label={decorative ? undefined : label}
            >
                🌐
            </span>
        )
    }

    return (
        <img
            className={`country-flag ${className}`.trim()}
            src={`/flags/${normalizedCode}.svg`}
            alt={decorative ? '' : label}
            aria-hidden={decorative ? 'true' : undefined}
            loading="lazy"
            decoding="async"
        />
    )
}

export default CountryFlag
