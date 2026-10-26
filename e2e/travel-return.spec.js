import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const locale of ['', '/en']) {
        test(`mobile travel restores the list position in ${engine} ${locale || '/fr'}`, async () => {
            test.setTimeout(60000)
            const browser = await browserType.launch()
            try {
                const context = await browser.newContext({
                    viewport: {width: 393, height: 790},
                    isMobile: true,
                    hasTouch: true,
                    reducedMotion: 'reduce',
                })
                const page = await context.newPage()
                await page.goto(`http://localhost:4173${locale}/travel`)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const trip = page.locator('.travel-timeline__item').nth(12)
                await trip.evaluate((el) =>
                    el.scrollIntoView({block: 'center', behavior: 'instant'})
                )
                await trip.click({trial: true})
                await trip.evaluate((el) =>
                    el.addEventListener(
                        'click',
                        () => {
                            window.tripReturnPosition = scrollY
                        },
                        {once: true}
                    )
                )
                let position = await page.evaluate(() => scrollY)
                expect(position).toBeGreaterThan(1000)
                await trip.click()
                position = await page.evaluate(() => window.tripReturnPosition)
                await expect(page.getByRole('dialog')).toBeVisible()
                await page.locator('.travel-timeline__back').click()
                await expect(page.getByRole('dialog')).toHaveCount(0)
                // WebKit may round a fractional layout offset to the adjacent CSS pixel.
                await expect
                    .poll(() => page.evaluate((top) => Math.abs(scrollY - top), position))
                    .toBeLessThanOrEqual(2)
                // Browser Back must restore the same context as the explicit return button.
                await trip.click()
                await expect(page.getByRole('dialog')).toBeVisible()
                await page.goBack()
                await expect(page.getByRole('dialog')).toHaveCount(0)
                // WebKit may round a fractional layout offset to the adjacent CSS pixel.
                await expect
                    .poll(() => page.evaluate((top) => Math.abs(scrollY - top), position))
                    .toBeLessThanOrEqual(2)
                await expect(trip).toBeInViewport()
                // A shared URL has no previous list position: return to the chronology start.
                await page.goto(`http://localhost:4173${locale}/travel/croatia-2026`)
                await expect(page.getByRole('dialog')).toBeVisible()
                await page.locator('.travel-timeline__back').click()
                await expect(page.getByRole('dialog')).toHaveCount(0)
                await expect(page.locator('.travel-timeline__item').first()).toBeInViewport()
            } finally {
                await browser.close()
            }
        })
    }
}
