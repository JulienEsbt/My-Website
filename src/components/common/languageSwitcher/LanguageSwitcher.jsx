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
        i18n.changeLanguage(next)
    }

    return (
        <div
            className="lang-switch"
            onClick={toggleLanguage}
            role="button"
            aria-label={next === 'fr' ? 'Passer en français' : 'Switch to English'}
        >
            <motion.div
                className="lang-slider"
                layout
                transition={{type: 'spring', stiffness: 500, damping: 30}}
                // Le curseur se place du côté de la langue à venir (plus logique visuellement)
                style={{justifyContent: next === 'fr' ? 'flex-start' : 'flex-end'}}
            >
                <motion.div
                    key={current} // pour animer le changement
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -6}}
                    transition={{duration: 0.2}}
                >
                    {/* Affiche le drapeau VERS lequel on va basculer */}
                    {next === 'fr' ? '🇬🇧' : '🇫🇷'}
                </motion.div>
            </motion.div>

            <div className="lang-labels">
                <span className={current === 'fr' ? 'active' : ''}>FR</span>
                <span className={current === 'en' ? 'active' : ''}>EN</span>
            </div>
        </div>
    )
}