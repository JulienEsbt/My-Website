import {test, expect} from '@playwright/test'

test('completed Skopje and Amsterdam journals work on mobile and desktop in both languages', async ({
    page,
}) => {
    for (const width of [393, 1440]) {
        await page.setViewportSize({width, height: 900})
        for (const prefix of ['', '/en']) {
            for (const [id, city, date] of [
                [
                    'north-macedonia-2026',
                    'Skopje',
                    prefix ? '22–29 September 2026' : '22–29 septembre 2026',
                ],
                [
                    'netherlands-2026',
                    'Amsterdam',
                    prefix ? '22–25 October 2026' : '22–25 octobre 2026',
                ],
            ]) {
                const path = `${prefix}/travel/${id}`
                await page.goto(path)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                await expect(page.locator('#travel-detail-title')).toHaveText(city)
                const flag = page.locator('.travel-timeline__detail-header .country-flag')
                await flag.scrollIntoViewIfNeeded()
                await expect
                    .poll(() => flag.evaluate((image) => image.complete && image.naturalWidth > 0))
                    .toBe(true)
                await expect(page.locator('.travel-timeline__detail-badges')).toContainText(date)
                await expect(page.locator('.travel-timeline__detail-badges')).not.toContainText(
                    /Prévu|Planned/
                )
                await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
                    'href',
                    `https://www.julienesterbet.com${path}`
                )
                if (city === 'Amsterdam')
                    await expect(
                        page.locator('.travel-timeline__detail-description')
                    ).toContainText('KUKO')
                expect(
                    await page.evaluate(() => document.documentElement.scrollWidth)
                ).toBeLessThanOrEqual(width)
            }
        }
    }
})
