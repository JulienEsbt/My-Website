import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`automatic English entry loads a document matching its canonical: ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const context = await browser.newContext({locale: 'en-GB'})
            await context.route('**/_vercel/**', (route) =>
                route.fulfill({status: 200, contentType: 'application/javascript', body: ''})
            )
            const page = await context.newPage()
            const documents = []
            page.on('response', (response) => {
                if (response.request().resourceType() === 'document')
                    documents.push(new URL(response.url()).pathname)
            })

            await page.goto('/?source=profile#portfolio')
            await expect(page).toHaveURL(/\/en\?source=profile#portfolio$/)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            expect(documents).toEqual(['/', '/en'])
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
                'href',
                'https://www.julienesterbet.com/en'
            )
            await expect(page.locator('html')).toHaveAttribute('lang', 'en')

            await page.goto('/reflections')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            await expect(page).toHaveURL(/\/reflections$/)
            await expect(page.locator('html')).toHaveAttribute('lang', 'fr')

            await page.goto('/reflections?filter=essai&lang=en#articles')
            await expect(page).toHaveURL(/\/en\/reflections\?filter=essai#articles$/)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            expect(documents.at(-1)).toBe('/en/reflections')

            await page.goto('/')
            await expect(page).toHaveURL(/\/en$/)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            expect(documents.at(-1)).toBe('/en')
        } finally {
            await browser.close()
        }
    })
}
