import {describe, expect, it, vi} from 'vitest'
import {createContactHandler} from './contactHandler.js'
import {createMemoryRateLimiter} from './contactSecurity.js'

const env = {
    CONTACT_ALLOWED_ORIGINS: 'https://portfolio.example',
    EMAILJS_SERVICE_ID: 'service-id',
    EMAILJS_TEMPLATE_ID: 'template-id',
    EMAILJS_PUBLIC_KEY: 'public-key',
}

function createRequest(body, {headers = {}, ...overrides} = {}) {
    return {
        method: 'POST',
        headers: {
            origin: 'https://portfolio.example',
            'content-type': 'application/json',
            'x-forwarded-for': '203.0.113.10',
            ...headers,
        },
        body,
        ...overrides,
    }
}

function createResponse() {
    const headers = new Map()
    return {
        statusCode: 200,
        body: null,
        headers,
        setHeader(name, value) {
            headers.set(name, value)
        },
        status(code) {
            this.statusCode = code
            return this
        },
        json(body) {
            this.body = body
            return this
        },
        end() {
            return this
        },
    }
}

function validBody(overrides = {}) {
    return {
        name: '  Julien   Esterbet ',
        email: ' JULIEN@example.com ',
        message: '  A sufficiently detailed contact message.  ',
        website: '',
        startedAt: 1000,
        ...overrides,
    }
}

describe('contact handler', () => {
    it('normalizes and sends a valid contact request', async () => {
        const sendEmail = vi.fn().mockResolvedValue(undefined)
        const handler = createContactHandler({env, sendEmail, now: () => 3000})
        const response = createResponse()

        await handler(createRequest(validBody()), response)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ok: true})
        expect(sendEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Julien Esterbet',
                email: 'julien@example.com',
                message: 'A sufficiently detailed contact message.',
            }),
            {env}
        )
    })

    it('rejects an unknown origin before processing personal data', async () => {
        const sendEmail = vi.fn()
        const handler = createContactHandler({env, sendEmail, now: () => 3000})
        const response = createResponse()

        await handler(
            createRequest(validBody(), {headers: {origin: 'https://malicious.example'}}),
            response
        )

        expect(response.statusCode).toBe(403)
        expect(sendEmail).not.toHaveBeenCalled()
    })

    it('silently accepts honeypot submissions without sending email', async () => {
        const sendEmail = vi.fn()
        const handler = createContactHandler({env, sendEmail, now: () => 3000})
        const response = createResponse()

        await handler(createRequest(validBody({website: 'spam.example'})), response)

        expect(response.statusCode).toBe(202)
        expect(response.body).toEqual({ok: true})
        expect(sendEmail).not.toHaveBeenCalled()
    })

    it('rejects invalid fields without returning their values', async () => {
        const response = createResponse()
        const handler = createContactHandler({env, now: () => 3000})

        await handler(createRequest(validBody({email: 'invalid'})), response)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ok: false, code: 'invalid_form'})
    })

    it('rejects oversized request bodies before validation', async () => {
        const response = createResponse()
        const handler = createContactHandler({env, now: () => 3000})

        await handler(
            createRequest(validBody(), {headers: {'content-length': String(20 * 1024)}}),
            response
        )

        expect(response.statusCode).toBe(413)
        expect(response.body).toEqual({ok: false, code: 'payload_too_large'})
    })

    it('limits repeated requests from the same client', async () => {
        const rateLimiter = createMemoryRateLimiter({limit: 1, now: () => 3000})
        const sendEmail = vi.fn().mockResolvedValue(undefined)
        const handler = createContactHandler({env, sendEmail, rateLimiter, now: () => 3000})

        await handler(createRequest(validBody()), createResponse())
        const limitedResponse = createResponse()
        await handler(createRequest(validBody()), limitedResponse)

        expect(limitedResponse.statusCode).toBe(429)
        expect(limitedResponse.headers.get('Retry-After')).toBeTruthy()
        expect(sendEmail).toHaveBeenCalledTimes(1)
    })

    it('returns a generic error when the provider fails', async () => {
        const handler = createContactHandler({
            env,
            sendEmail: vi.fn().mockRejectedValue(new Error('private provider details')),
            now: () => 3000,
        })
        const response = createResponse()

        await handler(createRequest(validBody()), response)

        expect(response.statusCode).toBe(502)
        expect(response.body).toEqual({ok: false, code: 'delivery_failed'})
        expect(JSON.stringify(response.body)).not.toContain('private provider details')
    })
})
