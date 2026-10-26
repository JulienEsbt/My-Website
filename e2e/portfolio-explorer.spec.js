import {test, expect} from '@playwright/test'
import {readFileSync} from 'node:fs'
const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')

test('the desktop index is keyboard accessible and preserves its project on return', async ({
    page,
}) => {
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.getByRole('tab')).toHaveCount(5)
    const bruno = page.getByRole('tab', {name: /Bruno Pizza/})
    await bruno.focus()
    await page.keyboard.press('ArrowDown')
    const openDente = page.getByRole('tab', {name: /OpenDente/})
    await expect(openDente).toBeFocused()
    await expect(openDente).toHaveAttribute('aria-selected', 'true')
    await page
        .getByRole('tabpanel')
        .getByRole('link', {name: 'Voir l’étude de cas', exact: true})
        .click()
    await expect(page).toHaveURL(/\/projects\/opendente$/)
    await page.getByRole('link', {name: 'Retour aux projets', exact: true}).click()
    await expect(page.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(page.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
    await page.getByRole('tab', {name: /OpenDente/}).focus()
    await page.keyboard.press('End')
    await expect(page.getByRole('tab', {name: /Agora/})).toHaveAttribute('aria-selected', 'true')
    await expect(
        page.getByRole('tabpanel').getByRole('heading', {name: 'Agora — Debate graph'})
    ).toBeVisible()
    await expect(page.getByRole('tabpanel').getByRole('link')).toHaveCount(0)
})

test('all five projects remain accessible on phones, tablets and wide screens', async ({page}) => {
    test.setTimeout(60000)
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.addScriptTag({content: axe})
    for (const width of [320, 390, 768, 1024, 1440, 2048]) {
        await page.setViewportSize({width, height: 1000})
        if (width <= 700) {
            const items = page.locator('#portfolio .mobile-accordion__item')
            await expect(items).toHaveCount(5)
            const openDente = items.filter({hasText: 'OpenDente — Personal Edition'})
            await openDente.locator(':scope > summary').click()
            await expect(
                openDente.getByRole('link', {name: 'Voir l’étude de cas', exact: true})
            ).toBeVisible()
            await openDente.locator(':scope > summary').click()
        } else {
            await expect(page.getByRole('tab')).toHaveCount(5)
            await expect(page.getByRole('tabpanel')).toHaveCount(1)
            await page.getByRole('tab', {name: /OpenDente/}).click()
            await expect(
                page
                    .getByRole('tabpanel')
                    .getByRole('heading', {name: 'OpenDente — Personal Edition'})
            ).toBeVisible()
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
        const issues = await page.evaluate(async () =>
            (
                await window.axe.run('#portfolio', {
                    runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']},
                })
            ).violations.map(({id, nodes}) => ({id, targets: nodes.map(({target}) => target)}))
        )
        expect(issues).toEqual([])
    }
})

test('all project descriptions and links remain readable without JavaScript', async ({browser}) => {
    const context = await browser.newContext({javaScriptEnabled: false})
    const page = await context.newPage()
    await page.goto('http://localhost:4173/#portfolio')
    for (const name of [
        'Bruno Pizza — Production',
        'OpenDente — Personal Edition',
        'My-Website',
        'Archivage de fichiers on-chain',
        'Agora — Graphe des débats',
    ]) {
        await expect(page.getByRole('heading', {name, exact: true})).toBeVisible()
    }
    await expect(
        page.getByRole('link', {name: 'Voir l’étude de cas · OpenDente — Personal Edition'})
    ).toHaveAttribute('href', '/projects/opendente')
    await context.close()
})
