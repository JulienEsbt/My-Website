import {describe, expect, it} from 'vitest'
import {createMemoryRateLimiter} from './contactSecurity.js'

describe('bounded contact rate limiter', () => {
    it('rejects new clients at capacity without evicting existing limits, then reclaims expired entries', () => {
        let time = 0
        const limiter = createMemoryRateLimiter({
            limit: 1,
            windowMs: 1000,
            maxClients: 2,
            now: () => time,
        })
        expect(limiter.check('a').allowed).toBe(true)
        expect(limiter.check('b').allowed).toBe(true)
        expect(limiter.check('c')).toEqual({allowed: false, retryAfter: 1})
        expect(limiter.check('a').allowed).toBe(false)
        time = 1001
        expect(limiter.check('c').allowed).toBe(true)
        expect(limiter.check('d').allowed).toBe(true)
        expect(limiter.check('e').allowed).toBe(false)
    })
})
