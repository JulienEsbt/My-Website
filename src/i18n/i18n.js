import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import statique (bundlé par Vite)
import i18n_en from './en.json'
import i18n_fr from './fr.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {common: i18n_en},
            fr: {common: i18n_fr}
        },
        ns: ['common'],
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
    document.documentElement.setAttribute('lang', lng);
});

export default i18n