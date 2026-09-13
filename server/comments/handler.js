import {createHash, createHmac, randomBytes, randomUUID, timingSafeEqual} from 'node:crypto'
import reflections from '../../src/data/reflections/reflections.js'
import {isAllowedOrigin} from '../contact/contactSecurity.js'
import {createCommentStore} from './store.js'
const hash = (value) => createHash('sha256').update(value).digest('hex')
const validId = (value) => typeof value === 'string' && /^[a-f0-9-]{36}$/.test(value)
const clean = (value, max, min = 0) =>
    typeof value === 'string' && value.trim().length >= min && value.trim().length <= max
export function createCommentsHandler({env = process.env, store = createCommentStore(env)} = {}) {
    return async (req, res) => {
        res.setHeader('Cache-Control', 'no-store')
        const send = (status, body) => res.status(status).json(body)
        if (!['GET', 'POST', 'DELETE'].includes(req.method))
            return send(405, {code: 'method_not_allowed'})
        if (!env.COMMENTS_DATABASE_URL || !env.COMMENTS_RATE_SECRET || !env.COMMENTS_ADMIN_TOKEN)
            return send(503, {code: 'not_configured'})
        const url = new URL(req.url, 'http://localhost')
        const slug = url.searchParams.get('slug')
        const language = url.searchParams.get('language')
        if (!reflections.some((item) => item.slug === slug) || !['fr', 'en'].includes(language))
            return send(400, {code: 'invalid_article'})
        try {
            if (req.method === 'GET') {
                const offset = Number(url.searchParams.get('offset') || 0)
                if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000)
                    return send(400, {code: 'invalid_offset'})
                return send(200, await store.list(slug, language, offset))
            }
            if (
                !isAllowedOrigin(req.headers.origin, {
                    ...env,
                    CONTACT_ALLOWED_ORIGINS: env.COMMENTS_ALLOWED_ORIGINS,
                })
            )
                return send(403, {code: 'origin_not_allowed'})
            if (!String(req.headers['content-type']).startsWith('application/json'))
                return send(415, {code: 'content_type'})
            if (Buffer.byteLength(JSON.stringify(req.body ?? null)) > 16000)
                return send(413, {code: 'too_large'})
            const data = req.body
            if (!data || typeof data !== 'object') return send(400, {code: 'invalid_form'})
            if (req.method === 'DELETE') {
                if (!validId(data.id)) return send(400, {code: 'invalid_form'})
                const token = String(req.headers.authorization || '').replace(/^Bearer /, '')
                const expected = env.COMMENTS_ADMIN_TOKEN
                const admin = timingSafeEqual(Buffer.from(hash(token)), Buffer.from(hash(expected)))
                const removed = await store.remove(
                    data.id,
                    hash(String(data.deleteToken || '')),
                    admin
                )
                return send(removed ? 200 : 403, {ok: removed})
            }
            if (
                !clean(data.pseudonym, 40, 2) ||
                !clean(data.body, 2000, 3) ||
                !clean(data.quote, 1000) ||
                !clean(data.prefix, 80) ||
                !clean(data.suffix, 80) ||
                data.website
            )
                return send(400, {code: 'invalid_form'})
            const address = env.VERCEL
                ? req.headers['x-vercel-forwarded-for']
                : req.socket?.remoteAddress
            const key = createHmac('sha256', env.COMMENTS_RATE_SECRET)
                .update(String(address || 'unknown').split(',')[0])
                .digest('hex')
            if (!(await store.allow(key))) {
                res.setHeader('Retry-After', '900')
                return send(429, {code: 'rate_limited'})
            }
            const deleteToken = randomBytes(32).toString('hex')
            const comment = await store.add({
                id: randomUUID(),
                slug,
                language,
                pseudonym: data.pseudonym.trim(),
                body: data.body.trim(),
                quote: data.quote.trim(),
                prefix: data.prefix,
                suffix: data.suffix,
                deleteHash: hash(deleteToken),
            })
            return send(201, {comment, deleteToken})
        } catch {
            return send(503, {code: 'unavailable'})
        }
    }
}
