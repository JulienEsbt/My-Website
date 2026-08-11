const METRICS_KEY = '__PORTFOLIO_PERFORMANCE__'

const round = (value, precision = 2) => Number(value.toFixed(precision))

export const initializePerformanceMetrics = () => {
    if (typeof window === 'undefined' || typeof window.PerformanceObserver === 'undefined') {
        return undefined
    }

    const shouldMeasure =
        import.meta.env.DEV || new URLSearchParams(window.location.search).has('measure')
    if (!shouldMeasure) return undefined

    const metrics = {
        lcp: null,
        cls: 0,
        inp: null,
        ttfb: null,
        measuredAt: new Date().toISOString(),
        mode: 'local-lab',
    }
    const observers = []

    const navigationEntry = window.performance?.getEntriesByType('navigation')[0]
    if (navigationEntry) metrics.ttfb = round(navigationEntry.responseStart)

    const observe = (type, callback, options = {}) => {
        try {
            const observer = new window.PerformanceObserver((list) => callback(list.getEntries()))
            observer.observe({type, buffered: true, ...options})
            observers.push(observer)
        } catch {
            // Le navigateur ne prend pas en charge cette métrique.
        }
    }

    observe('largest-contentful-paint', (entries) => {
        const latestEntry = entries.at(-1)
        if (latestEntry) metrics.lcp = round(latestEntry.startTime)
    })

    observe('layout-shift', (entries) => {
        entries.forEach((entry) => {
            if (!entry.hadRecentInput) metrics.cls = round(metrics.cls + entry.value, 4)
        })
    })

    observe(
        'event',
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.interactionId) return
                metrics.inp = Math.max(metrics.inp ?? 0, round(entry.duration))
            })
        },
        {durationThreshold: 16}
    )

    Object.defineProperty(window, METRICS_KEY, {
        configurable: true,
        value: metrics,
    })

    const disconnect = () => observers.forEach((observer) => observer.disconnect())
    window.addEventListener('pagehide', disconnect, {once: true})
    return disconnect
}
