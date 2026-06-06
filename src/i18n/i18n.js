import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import statiques
import main_en from './en/main_en.json'
import main_fr from './fr/main_fr.json'
import crypto_en from './en/crypto_en.json'
import crypto_fr from './fr/crypto_fr.json'
import travel_en from './en/travel_en.json'
import travel_fr from './fr/travel_fr.json'
import reflexions_en from './en/reflexions_en.json'
import reflexions_fr from './fr/reflexions_fr.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: main_en,
                crypto: crypto_en,
                travel: travel_en,
                reflexions: reflexions_en,
            },
            fr: {
                common: main_fr,
                crypto: crypto_fr,
                travel: travel_fr,
                reflexions: reflexions_fr,
            },
        },
        ns: ['common', 'crypto', 'travel', 'reflexions'],
        defaultNS: 'common',
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            lookupQuerystring: 'lang',
            caches: ['localStorage'],
        },
        interpolation: {escapeValue: false},
        returnNull: false,
        react: {useSuspense: false},
    })

i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('lang', lng)
})

export default i18n