import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterEach, beforeAll, vi} from 'vitest'
import {loadNamespaces} from '../i18n/i18n.js'

beforeAll(() => loadNamespaces(['home', 'web3', 'travel', 'reflections']))

afterEach(() => {
    cleanup()
})

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

globalThis.IntersectionObserver = class IntersectionObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}

window.scrollTo = vi.fn()
HTMLElement.prototype.scrollIntoView = vi.fn()
