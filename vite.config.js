import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import {createBlockchainStatusHandler} from './server/web3/blockchainStatusHandler.js'

function blockchainStatusDevApi(env) {
    const handler = createBlockchainStatusHandler({env})

    return {
        name: 'blockchain-status-dev-api',
        configureServer(server) {
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
        assetsInclude: ['**/*.JPG', '**/*.PNG'],
        test: {
            environment: 'jsdom',
            setupFiles: './src/test/setup.js',
            css: true,
        },
    }
})
