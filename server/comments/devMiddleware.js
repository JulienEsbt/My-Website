import {createCommentsHandler} from './handler.js'
export function commentsDevApi(env) {
    return {
        name: 'comments-dev-api',
        configureServer(server) {
            server.middlewares.use('/api/comments', async (req, res) => {
                const origin = req.headers.origin
                const origins = (server.resolvedUrls?.local || []).map((url) => new URL(url).origin)
                const handler = createCommentsHandler({
                    env: {...env, COMMENTS_ALLOWED_ORIGINS: origins.join(',')},
                })
                const adapter = {
                    setHeader: (name, value) => res.setHeader(name, value),
                    status(code) {
                        res.statusCode = code
                        return this
                    },
                    json(body) {
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(body))
                    },
                }
                if (req.method !== 'GET' && !origins.includes(origin))
                    return adapter.status(403).json({code: 'origin_not_allowed'})
                let bytes = 0
                const chunks = []
                try {
                    for await (const chunk of req) {
                        bytes += chunk.length
                        if (bytes > 16000) return adapter.status(413).json({code: 'too_large'})
                        chunks.push(chunk)
                    }
                    if (chunks.length) req.body = JSON.parse(Buffer.concat(chunks).toString())
                } catch {
                    return adapter.status(400).json({code: 'invalid_json'})
                }
                await handler(req, adapter)
            })
        },
    }
}
