import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const width of [320, 390]) {
        test(`comment action remains contained at 200% text size in ${engine} at ${width}px`, async () => {
            const browser = await browserType.launch()
            try {
                const page = await browser.newPage({
                    viewport: {width, height: 844},
                    locale: 'fr-FR',
                    reducedMotion: 'reduce',
                })
                await page.goto('http://localhost:4173/reflections/charte-de-pensee')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const button = page.getByRole('button', {
                    name: 'Commenter la réflexion',
                    exact: true,
                })
                await expect(button).toBeVisible()
                await page.evaluate(() => {
                    document.documentElement.style.fontSize = '200%'
                })

                const bounds = await button.evaluate((element) => {
                    const button = element.getBoundingClientRect()
                    const container = element.parentElement.getBoundingClientRect()
                    const style = getComputedStyle(element.parentElement)
                    return {
                        left: button.left,
                        right: button.right,
                        availableLeft: container.left + parseFloat(style.paddingLeft),
                        availableRight: container.right - parseFloat(style.paddingRight),
                        viewport: innerWidth,
                        clippedText: element.scrollWidth > element.clientWidth,
                    }
                })
                expect(bounds.left).toBeGreaterThanOrEqual(bounds.availableLeft)
                expect(bounds.right).toBeLessThanOrEqual(bounds.availableRight)
                expect(bounds.right).toBeLessThanOrEqual(bounds.viewport)
                expect(bounds.clippedText).toBe(false)
                await button.focus()
                await expect(button).toBeFocused()
                await button.press('Enter')
                await expect(page.getByRole('dialog')).toBeVisible()
            } finally {
                await browser.close()
            }
        })
    }
}
