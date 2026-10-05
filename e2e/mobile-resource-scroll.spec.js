import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`citizen selection follows native vertical scrolling without cropping in ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 393, height: 852},
                locale: 'fr-FR',
                reducedMotion: 'no-preference',
                isMobile: true,
                hasTouch: true,
            })
            await page.goto('http://localhost:4173/resources')
            const scene = page.locator('#selection .mobile-scroll-deck')
            await expect(scene).toHaveClass(/--animated/)
            await expect(scene.locator('.mobile-deck__controls')).toHaveCount(0)
            const go = async (index) => {
                await scene.evaluate(
                    (el, index) =>
                        window.scrollTo({
                            top:
                                scrollY +
                                el.getBoundingClientRect().top -
                                80 +
                                innerHeight * 0.72 * index,
                            behavior: 'instant',
                        }),
                    index
                )
                await expect(scene.locator('.mobile-deck__item').nth(index)).toHaveAttribute(
                    'aria-hidden',
                    'false'
                )
                await expect(scene.locator('.mobile-deck__item[aria-hidden="false"]')).toHaveCount(
                    1
                )
                const bounds = await scene.locator('.mobile-deck').boundingBox()
                expect(Math.abs(bounds.y - 80)).toBeLessThan(2)
                expect(bounds.y + bounds.height).toBeLessThan(770)
            }
            for (const index of [0, 1, 2, 3, 2, 1]) await go(index)
            await go(2)
            await scene.evaluate(() =>
                window.scrollBy({top: innerHeight * 0.72 * 0.7, behavior: 'instant'})
            )
            await expect
                .poll(() =>
                    scene
                        .locator('.mobile-deck__item')
                        .nth(2)
                        .evaluate((el) => Number(getComputedStyle(el).opacity))
                )
                .toBeLessThan(0.9)
            await expect(scene.locator('.mobile-deck__track')).toHaveCSS('display', 'grid')
            await go(2)
            const card = scene.locator('.civic-card').nth(2)
            await card.locator('summary').click()
            await expect(scene).not.toHaveClass(/--animated/)
            await expect(card.locator('.civic-card__mobile-context')).toBeVisible()
            expect(await card.evaluate((el) => el.scrollHeight <= el.clientHeight + 2)).toBe(true)
            await scene.getByRole('button', {name: 'Tout afficher'}).click()
            await expect(scene.locator('.mobile-deck__track')).toHaveCSS('overflow-x', 'visible')
            await page.reload()
            await expect(scene).toHaveClass(/--animated/)
            await page.emulateMedia({reducedMotion: 'reduce'})
            await expect(scene).not.toHaveClass(/--animated/)
            await page.emulateMedia({reducedMotion: 'no-preference'})
            await page.setViewportSize({width: 320, height: 568})
            await expect(scene).not.toHaveClass(/--animated/)
            await page.goto('http://localhost:4173/resources#resource-praxis')
            await expect(scene).not.toHaveClass(/--animated/)
            await page.setViewportSize({width: 393, height: 852})
            await expect(scene).not.toHaveClass(/--animated/)
        } finally {
            await browser.close()
        }
    })
}
