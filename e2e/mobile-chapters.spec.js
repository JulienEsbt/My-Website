import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`mobile professional chapters use native cards and preserve desktop structure in ${engine}`, async () => {
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 393, height: 790},
                locale: 'fr-FR',
                reducedMotion: 'reduce',
            })
            await page.goto('http://localhost:4173/?lang=fr')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            for (const id of ['experience']) {
                const deck = page.locator(`#${id} .mobile-deck`)
                const track = deck.locator('.mobile-deck__track')
                await deck
                    .getByRole('button', {name: 'Carte suivante'})
                    .evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}))
                await deck.getByRole('button', {name: 'Carte suivante'}).click()
                await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100)
                await expect(deck.locator('.mobile-deck__controls > span')).toContainText('02')
                await deck.getByRole('button', {name: 'Carte précédente'}).click()
                await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(2)
                const show = deck.getByRole('button', {name: 'Tout afficher'})
                await show.evaluate((el) =>
                    el.scrollIntoView({block: 'center', behavior: 'instant'})
                )
                await show.click()
                await expect(track).toHaveCSS('overflow-x', 'visible')
                await expect(deck.getByRole('button', {name: 'Vue cartes'})).toHaveAttribute(
                    'aria-pressed',
                    'true'
                )
            }
            await page.emulateMedia({reducedMotion: 'no-preference'})
            await expect(page.locator('.professional-chapter__step--mobile')).toHaveCount(0)
            await page.setViewportSize({width: 1440, height: 900})
            await expect(page.locator('.mobile-deck')).toHaveCount(0)
            await expect(page.locator('.home-hero')).toBeVisible()
            await expect(page.locator('.portfolio__container > .portfolio__item')).toHaveCount(3)
        } finally {
            await browser.close()
        }
    })
}
