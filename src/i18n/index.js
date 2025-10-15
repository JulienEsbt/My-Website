import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import statique (bundlé par Vite)
import common_en from '../locales/en/common.json'
import about_en from '../locales/en/about.json'
import common_fr from '../locales/fr/common.json'
import about_fr from '../locales/fr/about.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {common: common_en, about: about_en},
            fr: {common: common_fr, about: about_fr},
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        ns: ['common', 'about'],
        defaultNS: 'common',
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            lookupQuerystring: 'lang',
            caches: ['localStorage'],
        },
        interpolation: {escapeValue: false},
    })

export default i18n