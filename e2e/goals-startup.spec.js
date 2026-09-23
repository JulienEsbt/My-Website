import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const mobile of [false, true]) {
        test(`goals starts without interaction in production: ${engine}, ${mobile ? 'mobile EN' : 'desktop FR'}`, async () => {
            const browser = await browserType.launch()
            try {
                const page = await browser.newPage({
                    viewport: mobile ? {width: 393, height: 790} : {width: 1440, height: 1000},
                    isMobile: mobile,
                    hasTouch: mobile,
                    reducedMotion: 'no-preference',
                })
                await page.goto(`http://localhost:4173/${mobile ? 'en' : ''}`)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const carousel = page.locator('#goals .swiper')
                // Assert before any click, drag, resize or scroll can repair the instance.
                await expect(carousel.locator('.swiper-slide-active')).toHaveCount(1)
                await expect(carousel.locator('.swiper-pagination-bullet-active')).toHaveCount(1)
                const index = await carousel.evaluate((el) => el.swiper.realIndex)
                expect(Number.isFinite(index)).toBe(true)
                await expect
                    .poll(() => carousel.evaluate((el) => el.swiper.realIndex), {timeout: 10000})
                    .not.toBe(index)
                await carousel.scrollIntoViewIfNeeded()
                const section = page.locator('#goals')
                await section
                    .getByRole('button', {
                        name: mobile
                            ? 'Pause automatic scrolling'
                            : 'Mettre le défilement en pause',
                    })
                    .click()
                await expect
                    .poll(() => carousel.evaluate((el) => el.swiper.autoplay.running))
                    .toBe(false)
                await page.emulateMedia({reducedMotion: 'reduce'})
                await expect(carousel.locator('.swiper-slide-active')).toHaveCount(1)
                await expect
                    .poll(() => carousel.evaluate((el) => el.swiper.autoplay.running))
                    .toBe(false)
            } finally {
                await browser.close()
            }
        })
    }
}
