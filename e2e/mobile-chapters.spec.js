import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`mobile portfolio cards pause, zoom and release without inner scrolling in ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 393, height: 790},
                locale: 'fr-FR',
                reducedMotion: 'no-preference',
            })
            const errors = []
            page.on('pageerror', (error) => errors.push(error.message))
            await page.goto('http://localhost:4173/')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            for (const id of ['experience', 'services']) {
                const section = page.locator(`#${id}`)
                const step = section.locator('.professional-chapter__step').first()
                await expect(step).toHaveClass(/step--mobile/)
                const card = step.locator('article')
                const geometry = await step.evaluate((el) => ({
                    top: el.getBoundingClientRect().top + scrollY,
                    hold: parseFloat(el.style.getPropertyValue('--mobile-hold')),
                }))
                await page.evaluate((y) => scrollTo(0, y), geometry.top - 88 + 20)
                await expect
                    .poll(() => card.evaluate((el) => el.getBoundingClientRect().top))
                    .toBeCloseTo(88, 0)
                const initial = await card.evaluate((el) => el.getBoundingClientRect().width)
                await page.evaluate((y) => scrollTo(0, y), geometry.top - 88 + geometry.hold * 0.9)
                await expect
                    .poll(() => card.evaluate((el) => el.getBoundingClientRect().width))
                    .toBeGreaterThan(initial)
                expect(
                    await card.evaluate((el) => ({
                        top: el.getBoundingClientRect().top,
                        bottom: el.getBoundingClientRect().bottom,
                        innerScroll: el.scrollHeight > el.clientHeight + 1,
                    }))
                ).toEqual({top: 88, bottom: expect.any(Number), innerScroll: false})
                expect(await card.evaluate((el) => el.getBoundingClientRect().bottom)).toBeLessThan(
                    790 - 80
                )
                await page.evaluate((y) => scrollTo(0, y), geometry.top - 88 + geometry.hold + 100)
                await expect
                    .poll(() => card.evaluate((el) => el.getBoundingClientRect().top))
                    .toBeLessThan(0)
                await page.evaluate((y) => scrollTo(0, y), geometry.top - 88 + 20)
                await expect
                    .poll(() => card.evaluate((el) => el.getBoundingClientRect().top))
                    .toBeCloseTo(88, 0)
                // Address-bar height changes keep the same native scroll distance.
                await page.setViewportSize({width: 393, height: 850})
                expect(
                    await step.evaluate((el) =>
                        parseFloat(el.style.getPropertyValue('--mobile-hold'))
                    )
                ).toBe(geometry.hold)
                await page.setViewportSize({width: 393, height: 790})
                await section.getByRole('button', {name: 'Lecture continue', exact: true}).click()
                await expect(section.locator('.professional-chapter__step--mobile')).toHaveCount(0)
                await section.getByRole('button', {name: 'Lecture animée', exact: true}).click()
                await expect(step).toHaveClass(/step--mobile/)
            }
            await page.emulateMedia({reducedMotion: 'reduce'})
            await expect(page.locator('.professional-chapter__step--mobile')).toHaveCount(0)
            await page.emulateMedia({reducedMotion: 'no-preference'})
            await page.setViewportSize({width: 790, height: 393})
            await expect(page.locator('.professional-chapter__step--mobile')).toHaveCount(0)
            expect(errors).toEqual([])
        } finally {
            await browser.close()
        }
    })
}
