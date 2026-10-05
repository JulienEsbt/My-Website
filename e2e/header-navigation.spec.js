import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const route of ['/', '/web3']) {
        test(`social navigation remains visible with delayed animation frames in ${engine} on ${route}`, async () => {
            const browser = await browserType.launch()
            try {
                const context = await browser.newContext({
                    viewport: {width: 1710, height: 980},
                    locale: 'fr-FR',
                    reducedMotion: 'no-preference',
                })
                // Reproduce a browser that delays animation frames during startup.
                // Hydration must leave navigation visible without relying on a GSAP tick.
                await context.addInitScript(() => {
                    window.requestAnimationFrame = () => 0
                    window.cancelAnimationFrame = () => {}
                })
                const page = await context.newPage()
                await page.goto(`http://localhost:4173${route}`)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const nav = page.locator('header .header-socials')
                await expect(nav).toBeVisible()
                const hiddenAncestors = await nav.evaluate((el) => {
                    const hidden = []
                    for (let node = el; node; node = node.parentElement) {
                        const style = getComputedStyle(node)
                        if (Number(style.opacity) === 0 || style.visibility === 'hidden')
                            hidden.push(node.className || node.tagName)
                    }
                    return hidden
                })
                expect(hiddenAncestors).toEqual([])
                await expect(nav.getByRole('link', {name: 'LinkedIn'})).toHaveAttribute(
                    'href',
                    /linkedin\.com/
                )
                await expect(nav.getByRole('link', {name: 'GitHub'})).toHaveAttribute(
                    'href',
                    /github\.com/
                )
            } finally {
                await browser.close()
            }
        })
    }
}
