import {createContactHandler} from './contactHandler.js'
import {createMemoryRateLimiter} from './contactSecurity.js'

// Dev-only adapter: validate real requests without ever calling an email provider.
export function createContactDevMiddleware({origin, now = Date.now}) {
    const handler = createContactHandler({
        env: {CONTACT_ALLOWED_ORIGINS: origin},
        sendEmail: async () => {},
        rateLimiter: createMemoryRateLimiter(),
        now,
    })
    return async (request, response) => {
        const adapter = {
            setHeader: (name, value) => response.setHeader(name, value),
            status(code) {
                response.statusCode = code
                return this
            },
            end: () => response.end(),
            json(body) {
                response.setHeader('Content-Type', 'application/json; charset=utf-8')
                response.end(JSON.stringify(body.ok ? {...body, delivery: 'simulated'} : body))
            },
        }
        if (request.method === 'POST' && request.headers.origin === origin) {
            const chunks = []
            let bytes = 0
            try {
                for await (const chunk of request) {
                    bytes += Buffer.byteLength(chunk)
                    if (bytes > 16 * 1024) {
                        adapter.status(413).json({ok: false, code: 'payload_too_large'})
                        return
                    }
                    chunks.push(Buffer.from(chunk))
                }
                request.body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            } catch {
                adapter.status(400).json({ok: false, code: 'invalid_form'})
                return
            }
        }
        await handler(request, adapter)
    }
}
