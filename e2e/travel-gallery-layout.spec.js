import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`focus stays inside the photo opened from the mosaic in ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({locale: 'fr-FR', reducedMotion: 'reduce'})
            await page.goto('http://localhost:4173/travel/portugal-2025')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const trigger = page.locator('.travel-timeline__photo-more-wide')
            await trigger.press('Enter')
            const dialog = page.getByRole('dialog')
            await expect(dialog.getByRole('button', {name: 'Fermer la galerie'})).toBeFocused()
            await dialog.locator('.travel-timeline__gallery-mosaic button').nth(1).press('Enter')
            const close = dialog.getByRole('button', {name: 'Fermer la galerie'})
            const next = dialog.locator('.travel-timeline__lightbox-nav.next')
            await expect(close).toBeFocused()
            await page.keyboard.press('Shift+Tab')
            await expect(next).toBeFocused()
            await page.keyboard.press('Enter')
            await expect(dialog.locator('.travel-timeline__lightbox-counter')).toContainText('3 /')
            await expect(next).toBeFocused()
            await page.keyboard.press('Tab')
            await expect(close).toBeFocused()
            await page.keyboard.press('Escape')
            await expect(trigger).toBeFocused()
        } finally {
            await browser.close()
        }
    })

    for (const width of [393, 1440]) {
        test(`travel photos stay centered in ${engine} at ${width}px`, async () => {
            const browser = await browserType.launch()
            try {
                const page = await browser.newPage({
                    viewport: {width, height: 900},
                    reducedMotion: 'reduce',
                })
                await page.goto('http://localhost:4173/travel/portugal-2025')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                await page.locator('.travel-timeline__photo-hero').click()
                const photo = page.locator('.travel-timeline__lightbox-image-frame img')
                const centered = async () => {
                    await expect
                        .poll(() =>
                            photo.evaluate((image) => image.complete && image.naturalWidth > 0)
                        )
                        .toBe(true)
                    await expect
                        .poll(async () => {
                            const box = await photo.boundingBox()
                            return Math.abs(box.x + box.width / 2 - width / 2)
                        })
                        .toBeLessThanOrEqual(2)
                    const box = await photo.boundingBox()
                    expect(box.x).toBeGreaterThanOrEqual(0)
                    expect(box.x + box.width).toBeLessThanOrEqual(width)
                }
                await centered()
                await page.locator('.travel-timeline__lightbox-nav.next').click()
                await expect(page.locator('.travel-timeline__lightbox-counter')).toContainText(
                    '2 /'
                )
                await centered()
                await page.locator('.travel-timeline__lightbox-strip button').nth(4).click()
                await expect(page.locator('.travel-timeline__lightbox-counter')).toContainText(
                    '5 /'
                )
                await centered()
                await expect
                    .poll(() => photo.evaluate((image) => image.naturalWidth > image.naturalHeight))
                    .toBe(true)
                const position = await page.evaluate(() => scrollY)
                await page.mouse.wheel(0, 600)
                expect(await page.evaluate(() => scrollY)).toBe(position)
                await page.screenshot({
                    path: `/private/tmp/travel-gallery-restored-${engine}-${width}.png`,
                })
                await page.locator('.travel-timeline__lightbox-close').click()
                await expect(page.locator('.travel-timeline__lightbox')).toHaveCount(0)
            } finally {
                await browser.close()
            }
        })
    }
    test(`desktop travel selection keeps the chronology position in ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 1440, height: 900},
                reducedMotion: 'reduce',
            })
            await page.goto('http://localhost:4173/travel')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const trip = page.locator('.travel-timeline__item').nth(12)
            await trip.scrollIntoViewIfNeeded()
            await trip.click({trial: true})
            const position = await page.evaluate(() => scrollY)
            await trip.click()
            await expect(page.locator('#travel-detail-title')).toHaveText('Vienne')
            await expect
                .poll(() => page.evaluate((before) => Math.abs(scrollY - before), position))
                .toBeLessThanOrEqual(2)
        } finally {
            await browser.close()
        }
    })
}
