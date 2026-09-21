import {test, expect} from '@playwright/test'
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

test.beforeEach(async ({page}) => {
    await page.route('**/_vercel/**', (route) =>
        route.fulfill({status: 200, contentType: 'application/javascript', body: ''})
    )
})

test('the library switches language, expands sources with the keyboard and keeps direct links', async ({
    page,
}) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/resources')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const card = page.locator('#resource-monvote2027')
    const summary = card.locator('summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(card.locator('details')).toHaveAttribute('open', '')
    await expect(card.getByRole('link', {name: /Présentation/})).toHaveAttribute(
        'href',
        'https://monvote2027.fr/methodologie'
    )
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(page).toHaveURL(new RegExp('/en/resources$'))
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', {level: 1})).toHaveText('Understand. Question. Act.')
    await expect(card.locator('details')).toHaveAttribute('open', '')
    await expect(card.locator('.civic-card__visit')).toHaveAttribute(
        'href',
        'https://monvote2027.fr/'
    )
    expect(errors).toEqual([])
})

test('the resources remain accessible on narrow screens, including when a preview fails', async ({
    page,
}) => {
    await page.setViewportSize({width: 320, height: 760})
    await page.route('**/previews/citizen-resources/leurs-votes.webp', (route) => route.abort())
    await page.goto('/resources')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('#resource-leurs-votes').scrollIntoViewIfNeeded()
    await expect(page.locator('#resource-leurs-votes .civic-card__identity')).toBeVisible()
    await page.locator('#resource-medias summary').click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.addScriptTag({path: require.resolve('axe-core/axe.min.js')})
    const violations = await page.evaluate(async () =>
        (
            await window.axe.run(document.querySelector('.civic-page'), {
                runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']},
            })
        ).violations.map(({id}) => id)
    )
    expect(violations).toEqual([])
})

test('contextual entry and Agora return preserve the current language', async ({page}) => {
    await page.goto('/en/reflections')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('.citizen-resources-link a').click()
    await expect(page).toHaveURL(new RegExp('/en/resources$'))
    await page.locator('.civic-project a').first().click()
    await expect(page).toHaveURL(new RegExp('/en#agora-project-title$'))
    await expect(page.locator('#agora-project-title')).toBeInViewport()
    await page.locator('.citizen-resources-link a').click()
    await expect(page).toHaveURL(new RegExp('/en/resources$'))
})

test('both library pages expose content, sources and canonical URLs without JavaScript', async ({
    browser,
}) => {
    const context = await browser.newContext({javaScriptEnabled: false})
    const page = await context.newPage()
    for (const [path, language] of [
        ['/resources', 'fr'],
        ['/en/resources', 'en'],
    ]) {
        await page.goto(path)
        await expect(page.locator('html')).toHaveAttribute('lang', language)
        await expect(page.getByRole('heading', {name: 'Leurs Votes', exact: true})).toBeVisible()
        await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
            'href',
            'https://www.julienesterbet.com' + path
        )
        await page.locator('#resource-monvote2027 summary').click()
        await expect(page.locator('#resource-monvote2027 a[href$="/methodologie"]')).toBeVisible()
        await expect(page.locator('.civic-page iframe')).toHaveCount(0)
    }
    await context.close()
})

for (const engine of ['chromium', 'webkit']) {
    test.describe(`civic reading transitions in ${engine}`, () => {
        test('section navigation stays usable and animation never hides a returning card', async ({
            playwright,
        }) => {
            const browser = await playwright[engine].launch()
            const context = await browser.newContext({
                baseURL: 'http://localhost:4173',
                locale: 'fr-FR',
                viewport: {width: 1280, height: 720},
                reducedMotion: 'no-preference',
            })
            const page = await context.newPage()
            try {
                await page.addInitScript(() => {
                    window.civicReveals = []
                    const animate = Element.prototype.animate
                    Element.prototype.animate = function (...args) {
                        if (this.hasAttribute('data-civic-reveal'))
                            window.civicReveals.push(this.id)
                        return animate.apply(this, args)
                    }
                })
                await page.goto('/resources')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const card = page.locator('#resource-monvote2027')
                await card.scrollIntoViewIfNeeded()
                await expect
                    .poll(() =>
                        page.evaluate(() => window.civicReveals.includes('resource-monvote2027'))
                    )
                    .toBe(true)
                await expect.poll(() => card.evaluate((el) => el.getAnimations().length)).toBe(0)
                await expect(card).toHaveCSS('opacity', '1')
                await expect(card).toHaveCSS('transform', 'none')
                const nav = page.locator('.civic-section-nav')
                await nav.locator('a[href="#projects"]').click()
                await expect(nav.locator('[aria-current]')).toHaveAttribute('href', '#projects')
                await expect(page.locator('#projects-title')).toBeInViewport()
                const gap = await page.evaluate(
                    () =>
                        document.querySelector('#projects-title').getBoundingClientRect().top -
                        document.querySelector('.civic-section-nav').getBoundingClientRect().bottom
                )
                expect(gap).toBeGreaterThan(0)
                await nav.locator('a[href="#selection"]').click()
                await card.scrollIntoViewIfNeeded()
                await expect(card).toHaveCSS('opacity', '1')
                await expect(card).toHaveCSS('transform', 'none')
                expect(
                    await page.evaluate(
                        () =>
                            window.civicReveals.filter((id) => id === 'resource-monvote2027').length
                    )
                ).toBe(1)
                await page.emulateMedia({reducedMotion: 'reduce'})
                await page.locator('#resource-datan').scrollIntoViewIfNeeded()
                // WebKit delivers the preference change event asynchronously.
                await expect
                    .poll(() =>
                        page
                            .locator('.civic-page')
                            .evaluate((el) => el.getAnimations({subtree: true}).length)
                    )
                    .toBe(0)
                await page.setViewportSize({width: 390, height: 844})
                await nav.locator('a[href="#approach"]').click()
                await expect(nav.locator('[aria-current]')).toHaveAttribute('href', '#approach')
                await expect(page.locator('#approach-title')).toBeInViewport()
                expect(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
                ).toBe(true)
            } finally {
                await browser.close()
            }
        })
    })
}
