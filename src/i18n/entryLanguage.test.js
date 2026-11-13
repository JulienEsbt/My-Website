import {describe, expect, it, vi} from 'vitest'
import {
    LANGUAGE_PREFERENCE_KEY,
    applyInitialLanguage,
    detectPrimaryLanguage,
    readLanguagePreference,
    rememberLanguagePreference,
    resolveInitialLanguage,
} from './entryLanguage.js'

const createStorage = (initialValue = null) => {
    let value = initialValue
    return {
        getItem: vi.fn(() => value),
        setItem: vi.fn((_, nextValue) => {
            value = nextValue
        }),
    }
}

describe('entry language', () => {
    it.each([
        ['fr', 'fr'],
        ['fr-FR', 'fr'],
        ['fr-CA', 'fr'],
        ['en-GB', 'en'],
        ['de-DE', 'en'],
        [undefined, 'en'],
    ])('maps the primary browser language %s to %s', (language, expected) => {
        expect(detectPrimaryLanguage({languages: language ? [language] : []})).toBe(expected)
    })

    it('uses a remembered choice only on the neutral home URL', () => {
        const storage = createStorage('fr')
        expect(
            resolveInitialLanguage('https://www.julienesterbet.com/', {
                storage,
                browserNavigator: {languages: ['en-US']},
            })
        ).toMatchObject({language: 'fr', source: 'preference', targetUrl: '/'})
        expect(
            resolveInitialLanguage('https://www.julienesterbet.com/en/travel', {
                storage,
                browserNavigator: {languages: ['fr-FR']},
            })
        ).toMatchObject({language: 'en', source: 'url', targetUrl: '/en/travel'})
        expect(
            resolveInitialLanguage('https://www.julienesterbet.com/travel', {
                storage: createStorage('en'),
                browserNavigator: {languages: ['en-US']},
            })
        ).toMatchObject({language: 'fr', source: 'url', targetUrl: '/travel'})
    })

    it('keeps historical query choices explicit and remembers them', () => {
        const storage = createStorage()
        const historyObject = {state: {key: 'value'}, replaceState: vi.fn()}
        const locationObject = {replace: vi.fn()}
        const documentElement = {lang: 'fr', dataset: {}}
        const result = applyInitialLanguage({
            href: 'https://www.julienesterbet.com/travel?trip=croatia-2026&lang=en#stories',
            storage,
            historyObject,
            locationObject,
            documentElement,
        })

        expect(result).toMatchObject({language: 'en', source: 'query', redirecting: true})
        expect(locationObject.replace).toHaveBeenCalledWith('/en/travel?trip=croatia-2026#stories')
        expect(historyObject.replaceState).not.toHaveBeenCalled()
        expect(storage.setItem).toHaveBeenCalledWith(LANGUAGE_PREFERENCE_KEY, 'en')
        expect(documentElement).toMatchObject({
            lang: 'fr',
            dataset: {languageEntryPending: 'en'},
        })
    })

    it('loads the English document when the home entry follows the browser language', () => {
        const locationObject = {replace: vi.fn()}
        const result = applyInitialLanguage({
            href: 'https://www.julienesterbet.com/?source=profile#portfolio',
            storage: createStorage(),
            browserNavigator: {languages: ['en-GB']},
            locationObject,
            documentElement: {lang: 'fr', dataset: {}},
        })

        expect(result.redirecting).toBe(true)
        expect(locationObject.replace).toHaveBeenCalledWith('/en?source=profile#portfolio')
    })

    it('only cleans the query in place when the document already has the requested language', () => {
        const historyObject = {state: null, replaceState: vi.fn()}
        const locationObject = {replace: vi.fn()}
        const result = applyInitialLanguage({
            href: 'https://www.julienesterbet.com/en/travel?trip=croatia-2026&lang=en#stories',
            storage: createStorage(),
            historyObject,
            locationObject,
            documentElement: {lang: 'en', dataset: {}},
        })

        expect(result.redirecting).toBe(false)
        expect(locationObject.replace).not.toHaveBeenCalled()
        expect(historyObject.replaceState).toHaveBeenCalledWith(
            null,
            '',
            '/en/travel?trip=croatia-2026#stories'
        )
    })

    it('falls back safely when storage is unavailable', () => {
        const storage = {
            getItem: () => {
                throw new Error('blocked')
            },
            setItem: () => {
                throw new Error('blocked')
            },
        }
        expect(readLanguagePreference(storage)).toBeNull()
        expect(rememberLanguagePreference('fr', storage)).toBe(false)
        expect(
            resolveInitialLanguage('https://www.julienesterbet.com/', {
                storage,
                browserNavigator: {},
            })
        ).toMatchObject({language: 'en', source: 'browser', targetUrl: '/en'})
    })
})
