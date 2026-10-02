import {test, expect} from '@playwright/test'

for (const viewport of [
    {width: 1920, height: 1080},
    {width: 2560, height: 1440},
    {width: 3200, height: 1800},
]) {
    test(`civic scenes stay centered and readable at ${viewport.width}px`, async ({page}) => {
        await page.setViewportSize(viewport)
        await page.emulateMedia({reducedMotion: 'no-preference'})
        await page.goto('/resources')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        for (const id of ['approach', 'selection', 'projects', 'further']) {
            const scene = page
                .locator(`#${id} > .civic-zoom, #${id} .civic-scene, #${id} .civic-zoom`)
                .first()
            await expect(scene).toHaveClass(/--animated/)
            await scene.evaluate((el) => {
                const stage = el.querySelector('.civic-zoom__stage, .civic-scene__stage')
                scrollTo({
                    top:
                        scrollY +
                        el.getBoundingClientRect().top -
                        parseFloat(getComputedStyle(stage).top) +
                        60,
                    behavior: 'instant',
                })
            })
            const stage = scene.locator('.civic-zoom__stage, .civic-scene__stage')
            await expect
                .poll(async () => {
                    const box = await stage.boundingBox()
                    const dock = await page.locator('.civic-section-nav').boundingBox()
                    return Math.abs(box.y - 96 - (dock.y - 20 - box.y - box.height))
                })
                .toBeLessThan(35)
            const box = await stage.boundingBox()
            expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(5)
            expect(box.width).toBeGreaterThan(Math.min(1200, viewport.width * 0.55))
            expect(box.y).toBeGreaterThanOrEqual(95)
            if (viewport.width === 1920) await page.screenshot({path: `/tmp/civic-${id}.png`})
        }
        await page.screenshot({path: `/tmp/civic-desktop-${viewport.width}.png`})
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
    })
}
