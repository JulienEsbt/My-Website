import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe, expect, it} from 'vitest'

const vercelConfig = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'))
const headers = Object.fromEntries(
    Object.entries(vercelConfig.routes[0].headers).map(([key, value]) => [key.toLowerCase(), value])
)

describe('Vercel security headers', () => {
    it('defines the main browser security policies', () => {
        expect(headers['content-security-policy']).toContain("default-src 'self'")
        expect(headers['content-security-policy']).toContain("script-src 'self' 'unsafe-inline'")
        expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
        expect(headers['content-security-policy']).toContain("object-src 'none'")
        expect(headers['x-content-type-options']).toBe('nosniff')
        expect(headers['x-frame-options']).toBe('DENY')
        expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
        expect(headers['permissions-policy']).toContain('camera=()')
    })

    it('allows only the external connections currently required by the client', () => {
        const policy = headers['content-security-policy']
        expect(policy).toContain('https://api.mapbox.com')
        expect(policy).toContain('https://*.g.alchemy.com')
        expect(policy).toContain('https://api.coingecko.com')
        expect(policy).not.toContain('unpkg.com')
        expect(policy).not.toContain('fonts.googleapis.com')
        expect(policy).not.toContain('api.emailjs.com')
    })

    it('applies the policies before filesystem and 404 routing', () => {
        expect(vercelConfig.routes[0]).toMatchObject({src: '/(.*)', continue: true})
        expect(vercelConfig.routes[1]).toEqual({handle: 'filesystem'})
        expect(vercelConfig.routes[2]).toMatchObject({status: 404, dest: '/404.html'})
    })
})
