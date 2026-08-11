import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

export default defineConfig({
    plugins: [react(), mdx()],
    server: {port: 3000},
    assetsInclude: ['**/*.JPG', '**/*.PNG'],
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        css: true,
    },
})
