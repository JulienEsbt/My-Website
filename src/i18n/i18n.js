import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import common_en from './en/common_en.json'
import common_fr from './fr/common_fr.json'

const namespaceLoaders = {
    home: {
        en: () => import('./en/home_en.json'),
        fr: () => import('./fr/home_fr.json'),
    },
    projects: {
        en: () => import('./en/projects_en.json'),
        fr: () => import('./fr/projects_fr.json'),
    },
    resume: {
        en: () => import('./en/resume_en.json'),
        fr: () => import('./fr/resume_fr.json'),
    },
    web3: {
        en: () => import('./en/web3_en.json'),
        fr: () => import('./fr/web3_fr.json'),
    },
    travel: {
        en: () => import('./en/travel_en.json'),
        fr: () => import('./fr/travel_fr.json'),
    },
    reflections: {
        en: () => import('./en/reflections_en.json'),
        fr: () => import('./fr/reflections_fr.json'),
    },
}

const namespacePromises = new Map()

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: common_en,
            },
            fr: {
                common: common_fr,
            },
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

const updateDocumentLanguage = (language) => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language?.startsWith('fr') ? 'fr' : 'en'
}

updateDocumentLanguage(i18n.resolvedLanguage || i18n.language)
i18n.on('languageChanged', updateDocumentLanguage)

export const loadNamespace = (namespace) => {
    if (!namespaceLoaders[namespace]) return Promise.resolve()
    if (i18n.hasResourceBundle('en', namespace) && i18n.hasResourceBundle('fr', namespace)) {
        return Promise.resolve()
    }
    if (namespacePromises.has(namespace)) return namespacePromises.get(namespace)

    const namespacePromise = Promise.all([
        namespaceLoaders[namespace].en(),
        namespaceLoaders[namespace].fr(),
    ]).then(([english, french]) => {
        i18n.addResourceBundle('en', namespace, english.default, true, true)
        i18n.addResourceBundle('fr', namespace, french.default, true, true)
    })

    namespacePromises.set(namespace, namespacePromise)
    return namespacePromise
}

export const loadNamespaces = (namespaces) => Promise.all(namespaces.map(loadNamespace))

export default i18n
