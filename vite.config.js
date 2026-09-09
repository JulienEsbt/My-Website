import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import {createContactDevMiddleware} from './server/contact/contactDevMiddleware.js'
import {createBlockchainStatusHandler} from './server/web3/blockchainStatusHandler.js'

function blockchainStatusDevApi(env) {
    const handler = createBlockchainStatusHandler({env})

    return {
        name: 'blockchain-status-dev-api',
        configureServer(server) {
            const contactHandlers = new Map()
            server.middlewares.use('/api/contact', async (request, response) => {
                const origin = request.headers.origin
                const allowedOrigins = server.resolvedUrls?.local ?? []
                if (!allowedOrigins.some((url) => new URL(url).origin === origin)) {
                    response.statusCode = 403
                    response.setHeader('Content-Type', 'application/json')
                    response.end(JSON.stringify({ok: false, code: 'origin_not_allowed'}))
                    return
                }
                if (!contactHandlers.has(origin))
                    contactHandlers.set(origin, createContactDevMiddleware({origin}))
                await contactHandlers.get(origin)(request, response)
            })
            server.middlewares.use('/api/blockchain-status', async (request, response) => {
                const adapter = {
                    setHeader: (name, value) => response.setHeader(name, value),
                    status(code) {
                        response.statusCode = code
                        return this
                    },
                    json(body) {
                        response.setHeader('Content-Type', 'application/json; charset=utf-8')
                        response.end(JSON.stringify(body))
                    },
                }

                await handler(request, adapter)
            })
        },
    }
}

export default defineConfig(({mode}) => {
    const env = {...process.env, ...loadEnv(mode, process.cwd(), '')}

    return {
        plugins: [react(), mdx(), blockchainStatusDevApi(env)],
        server: {port: 3000},
        build: {manifest: true},
        assetsInclude: ['**/*.JPG', '**/*.PNG'],
        test: {
            environment: 'jsdom',
            exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'dist-ssr/**'],
            setupFiles: './src/test/setup.js',
            css: true,
        },
    }
})
