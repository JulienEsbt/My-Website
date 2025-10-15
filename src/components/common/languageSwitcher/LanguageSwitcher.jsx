import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import './LanguageSwitcher.css'

const LanguageSwitcher = () => {
    const {i18n} = useTranslation()
    const currentLang = i18n.language || 'en'

    const toggleLanguage = () => {
        const newLang = currentLang === 'fr' ? 'en' : 'fr'
        i18n.changeLanguage(newLang)
    }

    return (
        <div className="lang-switch" onClick={toggleLanguage} role="button" aria-label="Change language">
            <motion.div
                className="lang-slider"
                layout
                transition={{type: 'spring', stiffness: 500, damping: 30}}
                style={{justifyContent: currentLang === 'fr' ? 'flex-start' : 'flex-end'}}
            >
                <motion.div
                    key={currentLang}
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -6}}
                    transition={{duration: 0.2}}
                >
                    {currentLang === 'fr' ? '🇫🇷' : '🇬🇧'}
                </motion.div>
            </motion.div>

            <div className="lang-labels">
                <span className={currentLang === 'fr' ? 'active' : ''}>FR</span>
                <span className={currentLang === 'en' ? 'active' : ''}>EN</span>
            </div>
        </div>
    )
}

export default LanguageSwitcher