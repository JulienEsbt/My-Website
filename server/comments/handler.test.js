import {describe, it, expect, vi} from 'vitest'
import {createCommentsHandler} from './handler.js'
const env = {
    COMMENTS_DATABASE_URL: 'postgres://test',
    COMMENTS_RATE_SECRET: 'test-secret',
    COMMENTS_ADMIN_TOKEN: 'admin-private-test',
    COMMENTS_ALLOWED_ORIGINS: 'https://example.com',
}
const payload = {
    pseudonym: 'Camille',
    body: 'Je vois les choses autrement.',
    quote: 'Une phrase',
    prefix: '',
    suffix: '',
    website: '',
}
function setup(overrides = {}) {
    const store = {
        list: vi.fn().mockResolvedValue({comments: [], hasMore: false}),
        allow: vi.fn().mockResolvedValue(true),
        add: vi.fn(async (data) => ({id: data.id, body: data.body})),
        remove: vi.fn().mockResolvedValue(true),
    }
    const handler = createCommentsHandler({env, ...overrides, store})
    const res = {
        setHeader: vi.fn(),
        status: vi.fn(function (code) {
            this.code = code
            return this
        }),
        json: vi.fn(function (body) {
            this.body = body
            return this
        }),
    }
    const req = {
        method: 'POST',
        url: '/api/comments?slug=charte-de-pensee&language=fr',
        headers: {origin: 'https://example.com', 'content-type': 'application/json'},
        socket: {remoteAddress: '127.0.0.1'},
        body: {...payload},
    }
    return {store, handler, res, req}
}
describe('public comments API', () => {
    it('fails closed before database configuration', async () => {
        const {handler, req, res} = setup({env: {}})
        await handler(req, res)
        expect(res.code).toBe(503)
    })
    it('publishes immediately but never exposes deletion hashes', async () => {
        const {handler, req, res, store} = setup()
        await handler(req, res)
        expect(res.code).toBe(201)
        expect(res.body.deleteToken).toHaveLength(64)
        expect(store.add.mock.calls[0][0].deleteHash).not.toBe(res.body.deleteToken)
        expect(res.body.comment.deleteHash).toBeUndefined()
    })
    it('rejects foreign origins without storing anything', async () => {
        const {handler, req, res, store} = setup()
        req.headers.origin = 'https://evil.example'
        await handler(req, res)
        expect(res.code).toBe(403)
        expect(store.add).not.toHaveBeenCalled()
    })
    it('enforces database-backed rate limits', async () => {
        const {handler, req, res, store} = setup()
        store.allow.mockResolvedValue(false)
        await handler(req, res)
        expect(res.code).toBe(429)
        expect(store.add).not.toHaveBeenCalled()
        expect(store.allow.mock.calls[0][0]).not.toContain('127.0.0.1')
    })
    it('rejects oversized comments and unknown articles', async () => {
        const {handler, req, res, store} = setup()
        req.body.body = 'x'.repeat(2001)
        await handler(req, res)
        expect(res.code).toBe(400)
        req.url = '/api/comments?slug=unknown&language=fr'
        await handler(req, res)
        expect(res.code).toBe(400)
        expect(store.add).not.toHaveBeenCalled()
    })
    it('never turns a database error into an empty discussion', async () => {
        const {handler, req, res, store} = setup()
        req.method = 'GET'
        store.list.mockRejectedValue(new Error('private database details'))
        await handler(req, res)
        expect(res.code).toBe(503)
        expect(JSON.stringify(res.body)).not.toContain('private')
    })
    it('passes verified admin authorization only after constant time comparison', async () => {
        const {handler, req, res, store} = setup()
        req.method = 'DELETE'
        req.body = {id: '12345678-1234-1234-1234-123456789012'}
        req.headers.authorization = 'Bearer wrong'
        await handler(req, res)
        expect(store.remove.mock.calls[0][2]).toBe(false)
        req.headers.authorization = 'Bearer admin-private-test'
        await handler(req, res)
        expect(store.remove.mock.calls[1][2]).toBe(true)
    })
    it('validates pagination and language', async () => {
        const {handler, req, res} = setup()
        req.method = 'GET'
        req.url += '&offset=-1'
        await handler(req, res)
        expect(res.code).toBe(400)
    })
})
