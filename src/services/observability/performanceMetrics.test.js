import {afterEach, expect, it, vi} from 'vitest'
import {initializePerformanceMetrics} from './performanceMetrics.js'

afterEach(() => {
    window.dispatchEvent(new Event('pagehide'))
    delete window.__PORTFOLIO_PERFORMANCE__
    vi.unstubAllGlobals()
})

it('keeps the largest layout shift session and labels the interaction diagnostic', () => {
    const notify = new Map()
    vi.stubGlobal(
        'PerformanceObserver',
        class {
            static supportedEntryTypes = ['largest-contentful-paint', 'layout-shift', 'event']

            constructor(callback) {
                this.callback = callback
            }

            observe({type}) {
                notify.set(type, (entries) => this.callback({getEntries: () => entries}))
            }

            disconnect() {}
        }
    )

    initializePerformanceMetrics()
    const metrics = window.__PORTFOLIO_PERFORMANCE__
    expect(metrics.cls).toBe(0)

    notify.get('layout-shift')([
        {startTime: 0, value: 0.1},
        {startTime: 800, value: 0.2},
        {startTime: 1000, value: 1, hadRecentInput: true},
    ])
    notify.get('layout-shift')([
        {startTime: 1800, value: 0.08},
        {startTime: 2600, value: 0.08},
        {startTime: 3400, value: 0.08},
        {startTime: 4200, value: 0.08},
        {startTime: 5000, value: 0.08},
        {startTime: 5900, value: 0.08},
        {startTime: 6700, value: 0.08},
        {startTime: 6800, value: 0.3},
    ])
    notify.get('event')([
        {duration: 1000, interactionId: 0},
        {duration: 72, interactionId: 1},
        {duration: 56, interactionId: 2},
    ])

    expect(metrics.cls).toBe(0.56)
    expect(metrics.maxInteractionDurationMs).toBe(72)
    expect(metrics).not.toHaveProperty('inp')
})

it('leaves CLS unavailable when the browser silently ignores layout-shift entries', () => {
    vi.stubGlobal(
        'PerformanceObserver',
        class {
            static supportedEntryTypes = ['largest-contentful-paint', 'event']

            constructor(callback) {
                this.callback = callback
            }

            observe({type}) {
                if (type === 'largest-contentful-paint')
                    this.callback({getEntries: () => [{startTime: 120}]})
            }

            disconnect() {}
        }
    )

    initializePerformanceMetrics()

    expect(window.__PORTFOLIO_PERFORMANCE__).toMatchObject({lcp: 120, cls: null})
})

it('does not claim a zero CLS when supported entry types are unavailable', () => {
    vi.stubGlobal(
        'PerformanceObserver',
        class {
            observe() {}
            disconnect() {}
        }
    )

    initializePerformanceMetrics()

    expect(window.__PORTFOLIO_PERFORMANCE__.cls).toBeNull()
})
