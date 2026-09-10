import {defineConfig} from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    workers: 2,
    retries: 0,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:4173',
        locale: 'fr-FR',
        viewport: {width: 1280, height: 720},
        reducedMotion: 'reduce',
        trace: 'retain-on-failure',
    },
    webServer: [
        {
            command: 'npm run preview -- --host localhost --port 4173 --strictPort',
            url: 'http://localhost:4173',
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'npm run dev -- --host localhost --port 3101 --strictPort',
            url: 'http://localhost:3101',
            reuseExistingServer: !process.env.CI,
        },
    ],
})
