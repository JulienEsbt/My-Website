import {languageFromPath, languageSwitchUrl, localizedPath} from '../config/localizedPaths.js'

export const LANGUAGE_PREFERENCE_KEY = 'julienesterbet.language'

const supportedLanguage = (language) => (language === 'fr' || language === 'en' ? language : null)

const getStorage = (storage) => {
    if (storage !== undefined) return storage
    return globalThis.localStorage
}

export const readLanguagePreference = (storage) => {
    try {
        return supportedLanguage(getStorage(storage)?.getItem(LANGUAGE_PREFERENCE_KEY))
    } catch {
        return null
    }
}

export const rememberLanguagePreference = (language, storage) => {
    const preference = supportedLanguage(language)
    if (!preference) return false
    try {
        getStorage(storage)?.setItem(LANGUAGE_PREFERENCE_KEY, preference)
        return true
    } catch {
        return false
    }
}

export const detectPrimaryLanguage = (browserNavigator) => {
    try {
        const target = browserNavigator ?? globalThis.navigator
        const primaryLanguage = target?.languages?.[0] ?? target?.language
        return primaryLanguage?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
    } catch {
        return 'en'
    }
}

export const resolveInitialLanguage = (href, {storage, browserNavigator} = {}) => {
    const url = new URL(href, 'https://www.julienesterbet.com')
    const requestedLanguage = supportedLanguage(url.searchParams.get('lang'))

    if (requestedLanguage) {
        return {
            language: requestedLanguage,
            source: 'query',
            targetUrl: languageSwitchUrl(url.href, requestedLanguage),
        }
    }

    if (url.pathname !== '/') {
        return {
            language: languageFromPath(url.pathname),
            source: 'url',
            targetUrl: `${url.pathname}${url.search}${url.hash}`,
        }
    }

    const preference = readLanguagePreference(storage)
    const language = preference ?? detectPrimaryLanguage(browserNavigator)
    return {
        language,
        source: preference ? 'preference' : 'browser',
        targetUrl: `${localizedPath('/', language)}${url.search}${url.hash}`,
    }
}

export const applyInitialLanguage = ({
    href = globalThis.location?.href,
    storage,
    browserNavigator,
    historyObject = globalThis.history,
    documentElement = globalThis.document?.documentElement,
} = {}) => {
    const initialPath = new URL(href, 'https://www.julienesterbet.com').pathname
    const result = resolveInitialLanguage(href, {storage, browserNavigator})
    const currentUrl = new URL(href, 'https://www.julienesterbet.com')
    const currentRelativeUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`

    if (result.source === 'query') rememberLanguagePreference(result.language, storage)
    if (result.targetUrl !== currentRelativeUrl) {
        historyObject?.replaceState(historyObject.state, '', result.targetUrl)
    }
    if (documentElement) {
        documentElement.lang = result.language
        if (languageFromPath(initialPath) !== result.language) {
            documentElement.dataset.languageEntryPending = result.language
        }
    }

    return result
}
