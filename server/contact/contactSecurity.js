import {createHash} from 'node:crypto'

const DEFAULT_WINDOW_MS = 15 * 60 * 1000
const DEFAULT_LIMIT = 5
const MAX_TRACKED_CLIENTS = 5000

function asOrigin(value) {
    if (!value) return null
    const candidate = value.startsWith('http') ? value : `https://${value}`

    try {
        return new URL(candidate).origin
    } catch {
        return null
    }
}

export function getAllowedOrigins(env = process.env) {
    const configured = String(env.CONTACT_ALLOWED_ORIGINS ?? '')
        .split(',')
        .map((value) => asOrigin(value.trim()))
        .filter(Boolean)
    const vercelOrigins = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]
        .map(asOrigin)
        .filter(Boolean)

    return new Set([...configured, ...vercelOrigins])
}

export function isAllowedOrigin(origin, env = process.env) {
    const normalized = asOrigin(origin)
    return Boolean(normalized && getAllowedOrigins(env).has(normalized))
}

export function getClientFingerprint(request) {
    const forwarded =
        request.headers?.['x-vercel-forwarded-for'] ?? request.headers?.['x-forwarded-for']
    const address = String(forwarded ?? request.headers?.['x-real-ip'] ?? 'unknown')
        .split(',')[0]
        .trim()

    return createHash('sha256').update(address).digest('hex')
}

export function createMemoryRateLimiter({
    limit = DEFAULT_LIMIT,
    windowMs = DEFAULT_WINDOW_MS,
    now = Date.now,
} = {}) {
    const clients = new Map()

    return {
        check(key) {
            const currentTime = now()

            if (clients.size >= MAX_TRACKED_CLIENTS) {
                for (const [clientKey, entry] of clients) {
                    if (entry.resetAt <= currentTime) clients.delete(clientKey)
                }
            }

            const current = clients.get(key)
            if (!current || current.resetAt <= currentTime) {
                clients.set(key, {count: 1, resetAt: currentTime + windowMs})
                return {allowed: true, retryAfter: 0}
            }

            current.count += 1
            const retryAfter = Math.max(1, Math.ceil((current.resetAt - currentTime) / 1000))
            return {allowed: current.count <= limit, retryAfter}
        },
    }
}

export const contactRateLimiter = createMemoryRateLimiter()
