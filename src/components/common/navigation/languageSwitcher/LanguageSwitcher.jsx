// src/components/languageSwitcher/LanguageSwitcher.jsx
import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
import {languageSwitchUrl} from '../../../../config/localizedPaths.js'
import CountryFlag from '../../media/CountryFlag.jsx'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
    const {i18n} = useTranslation()
    const {pathname, search, hash} = useLocation()
    // Normalise: 'fr-FR' -> 'fr'
    const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)
    const next = current === 'fr' ? 'en' : 'fr'

    return (
        <a
            className="lang-switch"
            href={languageSwitchUrl(`${pathname}${search}${hash}`, next)}
            hrefLang={next}
            aria-label={next === 'fr' ? 'Passer en français' : 'Switch to English'}
        >
            <motion.div
                className="lang-slider"
                layout
                transition={{type: 'spring', stiffness: 500, damping: 30}}
                style={{justifyContent: next === 'fr' ? 'flex-start' : 'flex-end'}}
            >
                <motion.div
                    key={current}
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -6}}
                    transition={{duration: 0.2}}
                >
                    <CountryFlag code={current === 'fr' ? 'FR' : 'GB'} />
                </motion.div>
            </motion.div>

            <div className="lang-labels">
                <span className={current === 'fr' ? 'active' : ''}>FR</span>
                <span className={current === 'en' ? 'active' : ''}>EN</span>
            </div>
        </a>
    )
}
