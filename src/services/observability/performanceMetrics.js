const METRICS_KEY = '__PORTFOLIO_PERFORMANCE__'

const round = (value, precision = 2) => Number(value.toFixed(precision))

export const initializePerformanceMetrics = () => {
    if (typeof window === 'undefined' || typeof window.PerformanceObserver === 'undefined') {
        return undefined
    }

    const metrics = {
        lcp: null,
        cls: null,
        maxInteractionDurationMs: null,
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
            return true
        } catch {
            // Le navigateur ne prend pas en charge cette métrique.
            return false
        }
    }

    observe('largest-contentful-paint', (entries) => {
        const latestEntry = entries.at(-1)
        if (latestEntry) metrics.lcp = round(latestEntry.startTime)
    })

    let sessionStart
    let lastShift
    let sessionScore = 0
    let maximumSessionScore = 0
    const observesLayoutShifts = observe('layout-shift', (entries) => {
        entries.forEach((entry) => {
            if (entry.hadRecentInput) return
            if (
                sessionStart === undefined ||
                entry.startTime - lastShift >= 1000 ||
                entry.startTime - sessionStart >= 5000
            ) {
                sessionStart = entry.startTime
                sessionScore = 0
            }
            lastShift = entry.startTime
            sessionScore += entry.value
            maximumSessionScore = Math.max(maximumSessionScore, sessionScore)
        })
        metrics.cls = round(maximumSessionScore, 4)
    })
    if (observesLayoutShifts) metrics.cls ??= 0

    observe(
        'event',
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.interactionId) return
                metrics.maxInteractionDurationMs = Math.max(
                    metrics.maxInteractionDurationMs ?? 0,
                    round(entry.duration)
                )
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
