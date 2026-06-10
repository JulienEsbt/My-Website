import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import common_en from './en/common_en.json'
import common_fr from './fr/common_fr.json'
import home_en from './en/home_en.json'
import home_fr from './fr/home_fr.json'
import web3_en from './en/web3_en.json'
import web3_fr from './fr/web3_fr.json'
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
                common: common_en,
                home: home_en,
                web3: web3_en,
                travel: travel_en,
                reflexions: reflexions_en,
            },
            fr: {
                common: common_fr,
                home: home_fr,
                web3: web3_fr,
                travel: travel_fr,
                reflexions: reflexions_fr,
            },
        },
        ns: ['common', 'home', 'web3', 'travel', 'reflexions'],
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