import {describe, expect, it} from 'vitest'
import {sanitizeMeasurement} from './sanitizeMeasurement.js'

describe('measurement URL minimization', () => {
    it('strips query values and fragments without mutating the event', () => {
        const event = {
            type: 'pageview',
            url: 'https://example.com/en/travel?email=private%40example.com#secret',
        }
        expect(sanitizeMeasurement(event).url).toBe('https://example.com/en/travel')
        expect(event.url).toContain('email=')
    })
    it('redacts unknown paths and route labels', () => {
        expect(
            sanitizeMeasurement({
                url: 'https://example.com/en/private-wallet',
                route: '/en/private-wallet',
            })
        ).toMatchObject({url: 'https://example.com/en/404', route: '/en/404'})
    })
    it('keeps published article paths and rejects invalid events', () => {
        const url = 'https://example.com/reflections/charte-de-pensee'
        expect(sanitizeMeasurement({url}).url).toBe(url)
        expect(sanitizeMeasurement({url: 'invalid'})).toBeNull()
    })
})
