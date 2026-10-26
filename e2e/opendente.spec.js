import {test, expect} from '@playwright/test'
import {readFileSync} from 'node:fs'

const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')

test('OpenDente opens from the portfolio and keeps its place when switching language', async ({
    page,
}) => {
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.getByRole('tab', {name: /OpenDente/}).click()
    const card = page
        .locator('.portfolio__item')
        .filter({has: page.getByRole('heading', {name: 'OpenDente — Personal Edition'})})
    await expect(card.getByRole('link', {name: 'Voir le code'})).toHaveAttribute(
        'href',
        'https://github.com/JulienEsbt/OpenDente'
    )
    await card.getByRole('link', {name: 'Voir l’étude de cas', exact: true}).click()
    await expect(page).toHaveURL(/\/projects\/opendente$/)
    await expect(page.getByRole('heading', {level: 1})).toContainText('OpenDente')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://www.julienesterbet.com/projects/opendente'
    )
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(page).toHaveURL(/\/en\/projects\/opendente$/)
    await expect(page.getByRole('heading', {level: 1})).toContainText('OpenDente')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.getByRole('link', {name: 'Back to projects', exact: true}).click()
    await expect(page).toHaveURL(/\/en#portfolio$/)
})

test('product screenshots can be explored by keyboard with translated captions', async ({page}) => {
    await page.goto('/projects/opendente')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const gallery = page.locator('.opendente-gallery')
    const profiles = gallery.getByRole('button', {name: 'Profils du quotidien', exact: true})
    await profiles.focus()
    await page.keyboard.press('Enter')
    await expect(profiles).toHaveAttribute('aria-pressed', 'true')
    await expect(gallery.locator('figure img')).toHaveAttribute('alt', /panneau.*français/i)
    const previousImage = await gallery.locator('figure img').getAttribute('src')
    await gallery.getByRole('button', {name: 'Vue suivante'}).click()
    await expect(gallery.locator('figure img')).not.toHaveAttribute('src', previousImage)
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(gallery.getByRole('button', {name: 'Menu bar', exact: true})).toHaveAttribute(
        'aria-pressed',
        'true'
    )
    await expect(gallery.locator('figure img')).toHaveAttribute('alt', /English/)
    await expect(gallery.getByRole('link', {name: 'Enlarge screenshot'})).toHaveAttribute(
        'href',
        /menu-en.*webp/
    )
})

test('OpenDente remains readable and accessible across phone and desktop sizes', async ({page}) => {
    await page.goto('/projects/opendente')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.addScriptTag({content: axe})
    for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({width, height: 900})
        await expect(page.getByRole('heading', {level: 1})).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
        const violations = await page.evaluate(async () =>
            (
                await window.axe.run('.opendente-page', {
                    runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']},
                })
            ).violations.map(({id, nodes}) => ({id, targets: nodes.map(({target}) => target)}))
        )
        expect(violations).toEqual([])
        const image = page.locator('.opendente-gallery figure img')
        await image.scrollIntoViewIfNeeded()
        await expect
            .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
            .toBe(true)
    }
})

test('both OpenDente pages include readable content without JavaScript', async ({browser}) => {
    const context = await browser.newContext({javaScriptEnabled: false})
    const page = await context.newPage()
    for (const prefix of ['', '/en']) {
        await page.goto(`http://localhost:4173${prefix}/projects/opendente`)
        await expect(page.getByRole('heading', {level: 1})).toContainText('OpenDente')
        await expect(page.getByRole('link', {name: 'killerk3emstar/OpenDente'})).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('lang', prefix ? 'en' : 'fr')
    }
    await context.close()
})
