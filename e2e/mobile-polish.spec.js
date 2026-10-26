import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`phone dock, inline globe and card previews in ${engine}`, async () => {
        test.setTimeout(90000)
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 440, height: 956},
                locale: 'fr-FR',
                reducedMotion: 'no-preference',
                isMobile: true,
                hasTouch: true,
            })
            await page.goto('http://localhost:4173/?lang=fr')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const dock = page.locator('.section-nav')
            await expect(dock).toHaveCSS('opacity', '1')
            for (const width of [440, 320, 393, 700]) {
                await page.setViewportSize({width, height: 956})
                const box = await dock.boundingBox()
                expect(box.x).toBeGreaterThanOrEqual(7)
                expect(box.x + box.width).toBeLessThanOrEqual(width - 7)
                expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(2)
            }
            await page.setViewportSize({width: 393, height: 852})
            await page.emulateMedia({reducedMotion: 'reduce'})
            const preview = page.locator('#portfolio summary').first()
            await expect(preview.locator('img')).toBeVisible()
            await expect(preview.locator('strong')).toContainText('Bruno')
            await expect(preview.locator('small')).not.toBeEmpty()
            const deck = page.locator('#experience .mobile-deck')
            const peek = await deck.evaluate((el) => {
                const track = el.querySelector('.mobile-deck__track').getBoundingClientRect()
                const next = el.querySelectorAll('.mobile-deck__item')[1].getBoundingClientRect()
                return track.right - next.left
            })
            expect(peek).toBeGreaterThan(12)
            expect(peek).toBeLessThan(90)
            const goals = page.locator('#goals')
            await expect(goals.locator('.swiper-slide-active')).toHaveCount(1)
            const show = goals.getByRole('button', {name: 'Tout afficher'})
            await show.evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}))
            await show.click()
            await expect(goals.locator('.goals-carousel__fallback .goal-card')).toHaveCount(5)
            await goals.getByRole('button', {name: 'Vue carrousel'}).click()
            await expect(goals.locator('.swiper-slide-active')).toHaveCount(1)
            await page.goto('http://localhost:4173/travel')
            const map = page.locator('#mobile-travel-map')
            await expect(map.locator('#travel-explorer')).toHaveCount(0)
            await map
                .locator('summary')
                .evaluate((el) => el.scrollIntoView({block: 'start', behavior: 'instant'}))
            const before = await map.evaluate((el) => el.getBoundingClientRect().top)
            await map.locator(':scope > summary').click()
            await expect(map.locator('#travel-explorer')).toBeVisible()
            const after = await map.evaluate((el) => el.getBoundingClientRect().top)
            expect(Math.abs(after - before)).toBeLessThan(4)
            expect(
                await map.evaluate((el) =>
                    Boolean(
                        el.compareDocumentPosition(document.querySelector('#stories')) &
                        Node.DOCUMENT_POSITION_FOLLOWING
                    )
                )
            ).toBe(true)
            await map.locator(':scope > summary').click()
            await expect(map.locator('#travel-explorer')).toHaveCount(0)
            await expect(page.locator('.mobile-disclosure')).toHaveCount(1)
        } finally {
            await browser.close()
        }
    })
}
