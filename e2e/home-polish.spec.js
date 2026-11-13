import {test, expect, chromium, webkit} from '@playwright/test'
import {readFileSync} from 'node:fs'

const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const width of [393, 1440]) {
        for (const prefix of ['', '/en']) {
            test(`home polish preserves layout and improves controls: ${engine}, ${width}px, ${prefix || 'fr'}`, async () => {
                test.setTimeout(60000)
                const browser = await browserType.launch()
                try {
                    const page = await browser.newPage({
                        viewport: {width, height: 900},
                        deviceScaleFactor: 2,
                        locale: prefix ? 'en-GB' : 'fr-FR',
                        reducedMotion: 'reduce',
                    })
                    const errors = []
                    const requestedImages = []
                    page.on('pageerror', (error) => errors.push(error.message))
                    page.on('request', (request) => {
                        if (request.resourceType() === 'image') requestedImages.push(request.url())
                    })
                    await page.goto(`http://localhost:4173${prefix}/`)
                    await page.locator('#prerendered-content').waitFor({state: 'detached'})
                    const navigation = page.locator('.section-nav')
                    const travelLink = navigation.locator('a[href="#home-travel"]')
                    await expect(travelLink).toHaveAccessibleName(
                        prefix ? 'Travel overview' : 'Aperçu des voyages'
                    )
                    await expect(travelLink).toHaveAttribute(
                        'data-label',
                        prefix ? 'Travel' : 'Voyages'
                    )
                    await travelLink.click()
                    await expect(page.locator('#home-travel')).toBeInViewport()

                    const carousel = page.locator('#goals .swiper')
                    await carousel.scrollIntoViewIfNeeded()
                    const bullets = carousel.locator('.swiper-pagination-bullet')
                    await expect(bullets).toHaveCount(5)
                    for (const bullet of await bullets.all()) {
                        const box = await bullet.boundingBox()
                        expect(box.width).toBeGreaterThanOrEqual(24)
                        expect(box.height).toBeGreaterThanOrEqual(24)
                        const paintedHeight = await bullet.evaluate((el) => {
                            const style = getComputedStyle(el)
                            return (
                                el.getBoundingClientRect().height -
                                (style.backgroundClip === 'content-box'
                                    ? parseFloat(style.borderTopWidth) +
                                      parseFloat(style.borderBottomWidth) +
                                      parseFloat(style.paddingTop) +
                                      parseFloat(style.paddingBottom)
                                    : 0)
                            )
                        })
                        expect(paintedHeight).toBeLessThan(10)
                    }
                    await page.addScriptTag({content: axe})
                    const accessibility = await page.evaluate(async () =>
                        window.axe.run({include: ['#goals']}, {runOnly: ['target-size']})
                    )
                    expect(accessibility.violations).toEqual([])
                    await bullets.nth(3).click()
                    await expect(bullets.nth(3)).toHaveClass(/swiper-pagination-bullet-active/)
                    await bullets.nth(1).focus()
                    await page.keyboard.press('Enter')
                    await expect(bullets.nth(1)).toHaveClass(/swiper-pagination-bullet-active/)

                    const previews = page.locator('#portfolio .portfolio__preview img')
                    await previews.first().scrollIntoViewIfNeeded()
                    for (const image of await previews.all()) {
                        await image.scrollIntoViewIfNeeded()
                        await expect
                            .poll(() =>
                                image.evaluate((img) => img.complete && img.naturalWidth > 0)
                            )
                            .toBe(true)
                        if (!(await image.getAttribute('src'))?.includes('document-timestamp')) {
                            expect(await image.evaluate((img) => img.currentSrc)).toMatch(
                                /home-thumb-.*-(160|320)-/
                            )
                        }
                    }
                    if (width < 700) {
                        const portrait = page.locator('.mobile-home-entry__identity img')
                        await expect(portrait).toBeVisible()
                        expect(await portrait.evaluate((img) => img.currentSrc)).toMatch(
                            /home-thumb-portrait-256-/
                        )
                        expect(
                            requestedImages.filter((url) => url.includes('/media/hero/'))
                        ).toEqual([])
                        await page
                            .locator('#portfolio details')
                            .filter({hasText: prefix ? 'On-chain' : 'Archivage'})
                            .locator('summary')
                            .click()
                    } else {
                        await page.locator('#portfolio-tab-3').click()
                    }
                    const illustration = page.locator(
                        'img.portfolio__cover-image[src*="document-timestamp"]'
                    )
                    await expect(illustration).toHaveAttribute('width', '1600')
                    await expect(illustration).toHaveAttribute('height', '760')
                    expect(
                        await page.evaluate(() => document.documentElement.scrollWidth)
                    ).toBeLessThanOrEqual(width + 1)
                    expect(errors).toEqual([])
                } finally {
                    await browser.close()
                }
            })
        }
    }
}

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`desktop project covers use an appropriate image without changing their size: ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 1440, height: 900},
                deviceScaleFactor: 1,
                locale: 'fr-FR',
                reducedMotion: 'reduce',
            })
            await page.goto('http://localhost:4173/')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            for (const [id, resource] of [
                ['1', /01-dashboard-640-/],
                ['2', /hero-800-/],
            ]) {
                await page.locator(`#portfolio-tab-${id}`).click()
                const cover = page.locator(
                    `.portfolio__item[data-project="${id}"] .portfolio__cover-image`
                )
                await cover.scrollIntoViewIfNeeded()
                await expect
                    .poll(() => cover.evaluate((img) => img.complete && img.naturalWidth > 0))
                    .toBe(true)
                expect(await cover.evaluate((img) => img.currentSrc)).toMatch(resource)
                const box = await cover.boundingBox()
                expect(box.width).toBeGreaterThan(500)
                expect(box.height).toBeGreaterThan(290)
            }
        } finally {
            await browser.close()
        }
    })
}
