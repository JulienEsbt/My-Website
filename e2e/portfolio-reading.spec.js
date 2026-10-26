import {test, expect, chromium, webkit} from '@playwright/test'
import axe from 'axe-core'

for (const [name, engine] of Object.entries({chromium, webkit})) {
    test(`Agora reading preserves the guided journey in ${name}`, async () => {
        const browser = await engine.launch()
        try {
            const page = await browser.newPage({
                viewport: {width: 1600, height: 1000},
                locale: 'fr-FR',
                reducedMotion: 'no-preference',
            })
            await page.goto('http://localhost:4173/#portfolio')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const journey = page.locator('.portfolio__journey')
            await expect(journey).toHaveAttribute('data-scroll-enabled', 'true')
            await page.getByRole('tab', {name: /Agora/}).click()
            await expect
                .poll(() =>
                    journey.evaluate((el) =>
                        Math.abs(
                            (parseFloat(getComputedStyle(el).getPropertyValue('--project-top')) -
                                el.getBoundingClientRect().top) /
                                parseFloat(
                                    getComputedStyle(el).getPropertyValue('--project-step-distance')
                                ) -
                                4
                        )
                    )
                )
                .toBeLessThan(0.0015)
            const trigger = page.getByRole('button', {name: 'Découvrir l’intention du projet'})
            await trigger.click()
            const dialog = page.getByRole('dialog', {name: 'Agora — Graphe des débats'})
            await expect(dialog).toBeVisible()
            await expect(dialog.getByText(/Un prototype local non publié/)).toBeVisible()
            await expect(page.locator('body')).toHaveCSS('position', 'fixed')
            // The click can finish smooth scrolling before the dialog locks the body.
            // Compare against the actual locked position, not an earlier animation frame.
            const before = await page
                .locator('body')
                .evaluate((body) => -parseFloat(body.style.top))
            expect(Number.isFinite(before)).toBe(true)
            await page.addScriptTag({content: axe.source})
            expect(
                await page.evaluate(() =>
                    window.axe.run(document.querySelector('dialog')).then((r) => r.violations)
                )
            ).toEqual([])
            await page.keyboard.press('Escape')
            await expect(dialog).not.toBeVisible()
            await expect(trigger).toBeFocused()
            await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
            await expect
                .poll(() => page.evaluate((y) => Math.abs(scrollY - y), before))
                .toBeLessThan(3)
            await expect(journey).toHaveAttribute('data-scroll-enabled', 'true')
            const distance = await journey.evaluate((el) =>
                parseFloat(getComputedStyle(el).getPropertyValue('--project-step-distance'))
            )
            await page.mouse.wheel(0, -distance)
            await expect(page.getByRole('tab', {name: /Archivage/})).toHaveAttribute(
                'aria-selected',
                'true'
            )
            await page.mouse.wheel(0, distance)
            await expect(page.getByRole('tab', {name: /Agora/})).toHaveAttribute(
                'aria-selected',
                'true'
            )
            await trigger.click()
            await dialog.getByRole('button', {name: 'Fermer'}).click()
            await page.getByRole('tab', {name: /OpenDente/}).click()
            await expect(page.getByRole('tabpanel')).toContainText('OpenDente — Personal Edition')
            await page.setViewportSize({width: 393, height: 852})
            const accordion = page
                .locator('#portfolio .mobile-accordion__item')
                .filter({hasText: 'Agora — Graphe des débats'})
            await accordion.locator(':scope > summary').click()
            await trigger.click()
            await expect(dialog).toBeVisible()
            expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
            await dialog.evaluate((el) => {
                el.scrollTop = el.scrollHeight
            })
            await expect(dialog.getByRole('button', {name: 'Fermer'})).toBeInViewport()
            await dialog.getByRole('button', {name: 'Fermer'}).click()
            await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
        } finally {
            await browser.close()
        }
    })
}

test('My-Website uses the new responsive image only in the solution story', async ({page}) => {
    for (const prefix of ['', '/en']) {
        await page.goto(`${prefix}/projects/my-website`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await expect(page.locator('.case-study__visual')).toHaveCount(0)
        const picture = page.locator('#solution picture')
        await expect(picture.locator('source[type="image/avif"]')).toHaveAttribute(
            'srcset',
            /hero-1440/
        )
        const img = picture.locator('img')
        await img.scrollIntoViewIfNeeded()
        await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true)
        await expect(img).toHaveAttribute('alt', /Julien Esterbet/)
        expect(await img.evaluate((el) => /hero-/.test(el.currentSrc))).toBe(true)
    }
})
