// src/components/languageSwitcher/LanguageSwitcher.jsx
import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
    const {i18n} = useTranslation()
    // Normalise: 'fr-FR' -> 'fr'
    const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)
    const next = current === 'fr' ? 'en' : 'fr'

    const toggleLanguage = () => {
        const url = new URL(window.location.href)
        url.searchParams.set('lang', next)
        window.history.replaceState(
            window.history.state,
            '',
            `${url.pathname}${url.search}${url.hash}`
        )
        i18n.changeLanguage(next)
    }

    return (
        <button
            type="button"
            className="lang-switch"
            onClick={toggleLanguage}
            aria-label={next === 'fr' ? 'Passer en français' : 'Switch to English'}
        >
            <motion.span
                className="lang-active-indicator"
                aria-hidden="true"
                animate={{x: current === 'fr' ? 0 : 40}}
                transition={{type: 'spring', stiffness: 500, damping: 34}}
            />

            <div className="lang-labels">
                <span className={current === 'fr' ? 'active' : ''}>FR</span>
                <span className={current === 'en' ? 'active' : ''}>EN</span>
            </div>
        </button>
    )
}
