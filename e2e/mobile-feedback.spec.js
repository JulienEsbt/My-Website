import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`mobile feedback layouts and playback in ${engine}`, async () => {
        test.setTimeout(90000)
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 393, height: 852},
                locale: 'fr-FR',
                reducedMotion: 'reduce',
            })
            const settle = async (locator) =>
                locator.evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}))
            await page.goto('http://localhost:4173/?lang=fr')
            const projects = page.locator('#portfolio .mobile-accordion__item')
            await expect(projects).toHaveCount(3)
            const sizes = await projects.evaluateAll((nodes) =>
                nodes.map((el) => el.getBoundingClientRect().height)
            )
            expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThan(2)
            await settle(projects.first().locator('summary'))
            await projects.first().locator('summary').click()
            await expect(projects.first().locator('.portfolio__body')).toBeVisible()
            await settle(page.locator('.portfolio__intent summary'))
            await page.locator('.portfolio__intent summary').click()
            await expect(page.locator('.portfolio__intent-content')).toBeVisible()
            await expect(projects.first().locator('.portfolio__body')).toBeVisible()
            await expect(page.locator('#services .service')).toHaveCount(3)
            await expect(page.locator('#services details')).toHaveCount(0)
            const deck = page.locator('#home-reflections .mobile-deck')
            await expect(deck.locator('.mobile-deck__item')).toHaveCount(2)
            const geometry = await deck.evaluate((el) => ({
                track: el.querySelector('.mobile-deck__track').getBoundingClientRect().bottom,
                controls: el.querySelector('.mobile-deck__controls').getBoundingClientRect().top,
            }))
            expect(geometry.controls).toBeGreaterThan(geometry.track)
            await page.goto('http://localhost:4173/web3')
            await expect(page.locator('#tools button[aria-expanded="false"]')).toHaveCount(2)
            await page.goto('http://localhost:4173/reflections')
            await expect(page.locator('.reflection-entry-note')).toHaveCount(0)
            await page.goto('http://localhost:4173/travel')
            const tops = await page
                .locator('.travel-stat strong')
                .evaluateAll((nodes) => nodes.map((el) => el.getBoundingClientRect().top))
            expect(Math.abs(tops[0] - tops[1])).toBeLessThan(2)
            expect(Math.abs(tops[2] - tops[3])).toBeLessThan(2)
            await expect(page.locator('.mobile-map-invitation')).toBeVisible()
            await settle(page.locator('.mobile-map-invitation'))
            await page.locator('.mobile-map-invitation').click()
            await expect(page.locator('#mobile-travel-map')).toHaveAttribute('open', '')
            await page.goto('http://localhost:4173/resources')
            await expect(page.locator('#further .mobile-accordion__item')).toHaveCount(4)
            const gap = await page.evaluate(
                () =>
                    document.querySelector('footer').getBoundingClientRect().top -
                    document.querySelector('.civic-notes').getBoundingClientRect().bottom
            )
            expect(gap).toBeLessThan(100)
            await page.emulateMedia({reducedMotion: 'no-preference'})
            const selection = page.locator('#selection .mobile-scroll-deck')
            await expect(selection).toHaveClass(/mobile-scroll-deck--animated/)
            await selection.evaluate((el) =>
                window.scrollTo({
                    top: scrollY + el.getBoundingClientRect().top - 80 + innerHeight * 0.72,
                    behavior: 'instant',
                })
            )
            await expect(selection.locator('.mobile-deck__item').nth(1)).toHaveAttribute(
                'aria-hidden',
                'false'
            )
            await page.setViewportSize({width: 1440, height: 900})
            await page.goto('http://localhost:4173/web3')
            await expect(page.locator('#tools button[aria-expanded="true"]')).toHaveCount(2)
            await page.goto('http://localhost:4173/reflections')
            await expect(page.locator('.reflection-entry-note')).toBeVisible()
        } finally {
            await browser.close()
        }
    })
}
