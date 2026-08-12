import {contactRateLimiter, getClientFingerprint, isAllowedOrigin} from './contactSecurity.js'
import {sendContactEmail} from './emailProvider.js'
import {validateContactPayload} from './contactValidation.js'

const MINIMUM_COMPLETION_MS = 1000
const MAXIMUM_BODY_BYTES = 16 * 1024

function sendJson(response, status, body) {
    response.status(status).json(body)
}

function setCorsHeaders(response, origin) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Vary', 'Origin')
}

export function createContactHandler({
    env = process.env,
    sendEmail = sendContactEmail,
    rateLimiter = contactRateLimiter,
    now = Date.now,
} = {}) {
    return async function contactHandler(request, response) {
        response.setHeader('Cache-Control', 'no-store')

        const origin = request.headers?.origin
        if (!isAllowedOrigin(origin, env)) {
            return sendJson(response, 403, {ok: false, code: 'origin_not_allowed'})
        }
        setCorsHeaders(response, origin)

        if (request.method === 'OPTIONS') {
            return response.status(204).end()
        }

        if (request.method !== 'POST') {
            response.setHeader('Allow', 'POST, OPTIONS')
            return sendJson(response, 405, {ok: false, code: 'method_not_allowed'})
        }

        const contentType = String(request.headers?.['content-type'] ?? '')
            .split(';')[0]
            .trim()
            .toLowerCase()
        if (contentType !== 'application/json') {
            return sendJson(response, 415, {ok: false, code: 'unsupported_media_type'})
        }

        const contentLength = Number(request.headers?.['content-length'] ?? 0)
        if (Number.isFinite(contentLength) && contentLength > MAXIMUM_BODY_BYTES) {
            return sendJson(response, 413, {ok: false, code: 'payload_too_large'})
        }

        const validation = validateContactPayload(request.body)
        if (!validation.ok) {
            return sendJson(response, 400, {ok: false, code: 'invalid_form'})
        }

        const {data} = validation
        if (data.website || now() - data.startedAt < MINIMUM_COMPLETION_MS) {
            return sendJson(response, 202, {ok: true})
        }

        const rateLimit = rateLimiter.check(getClientFingerprint(request))
        if (!rateLimit.allowed) {
            response.setHeader('Retry-After', String(rateLimit.retryAfter))
            return sendJson(response, 429, {ok: false, code: 'rate_limited'})
        }

        try {
            await sendEmail(data, {env})
            return sendJson(response, 200, {ok: true})
        } catch {
            return sendJson(response, 502, {ok: false, code: 'delivery_failed'})
        }
    }
}
