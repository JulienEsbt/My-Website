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
                await page.goto('/resources')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const card = page.locator('#resource-datan')
                await card.scrollIntoViewIfNeeded()
                await expect(card).toBeVisible()
                await expect(card).toHaveCSS('opacity', '1')
                const nav = page.locator('.civic-section-nav')
                await nav.locator('a[href="#projects"]').click()
                await expect(nav.locator('[aria-current]')).toHaveAttribute('href', '#projects')
                await expect(page.locator('#projects-title')).toBeInViewport()
                // Upward native smooth scrolling can mark the section active before settling.
                await expect
                    .poll(() =>
                        page.evaluate(
                            () =>
                                document.querySelector('#projects-title').getBoundingClientRect()
                                    .top -
                                document.querySelector('.civic-section-nav').getBoundingClientRect()
                                    .bottom
                        )
                    )
                    .toBeGreaterThan(0)
                await nav.locator('a[href="#selection"]').click()
                await card.scrollIntoViewIfNeeded()
                await expect(card).toHaveCSS('opacity', '1')
                await expect(card).toHaveCSS('transform', 'none')
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

for (const engine of ['chromium', 'webkit']) {
    for (const variant of ['selection', 'further']) {
        const ids =
            variant === 'selection'
                ? ['leurs-votes', 'monvote2027', 'praxis', 'transparence']
                : ['medias', 'datan', 'wikidebats', 'madada']
        test(`the ${variant} scroll scene works forwards, backwards and with keyboard sources in ${engine}`, async ({
            playwright,
        }) => {
            const browser = await playwright[engine].launch()
            const page = await browser.newPage({
                baseURL: 'http://localhost:4173',
                locale: 'fr-FR',
                viewport: {width: 1440, height: 1000},
                reducedMotion: 'no-preference',
            })
            const errors = []
            page.on('pageerror', (error) => errors.push(error.message))
            try {
                await page.goto('/resources')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const scene = page.locator(`#${variant} .civic-scene`)
                await expect(scene).toHaveClass(/civic-scene--animated/)
                const scrollToStep = async (step) => {
                    await scene.evaluate(
                        (el, value) =>
                            scrollTo({
                                top:
                                    scrollY +
                                    el.getBoundingClientRect().top -
                                    100 +
                                    value * innerHeight * 0.72,
                                behavior: 'instant',
                            }),
                        step
                    )
                }
                const panels = scene.locator('.civic-scene__panel')
                for (const index of [0, 1, 2, 3, 2, 1, 0]) {
                    await scrollToStep(index)
                    await expect(panels.nth(index)).toHaveAttribute('aria-hidden', 'false')
                    await expect(panels.nth(index)).toHaveCSS('opacity', '1')
                    await expect(scene.locator('.civic-scene__panel:not([inert])')).toHaveCount(1)
                    const box = await panels.nth(index).boundingBox()
                    expect(box.y).toBeGreaterThan(100)
                    expect(box.y + box.height).toBeLessThan(1000)
                }
                // No overlapping bodies or orphaned links during a partial transition.
                for (const fraction of [0.4, 0.6, 0.75]) {
                    await scrollToStep(fraction)
                    await expect
                        .poll(() =>
                            panels.evaluateAll(
                                (items) =>
                                    items.filter((el) => Number(el.style.opacity) > 0.01).length
                            )
                        )
                        .toBeLessThanOrEqual(1)
                }
                await scene.locator('.civic-scene__steps button').nth(1).click()
                await expect(panels.nth(1)).toHaveAttribute('aria-hidden', 'false')
                const summary = page.locator(`#resource-${ids[1]} summary`)
                await summary.focus()
                await page.keyboard.press('Enter')
                await expect(scene).not.toHaveClass(/civic-scene--animated/)
                await expect(page.locator(`#resource-${ids[1]} details`)).toHaveAttribute(
                    'open',
                    ''
                )
                await expect(summary).toBeFocused()
                await expect(scene.locator('[inert]')).toHaveCount(0)
                await expect(summary).toBeInViewport()
                await page.goto(`/en/resources#resource-${ids[2]}`)
                await expect(scene).not.toHaveClass(/civic-scene--animated/)
                await expect(page.locator(`#resource-${ids[2]}`)).toBeInViewport()
                await page.goto('/resources')
                await expect(scene).toHaveClass(/civic-scene--animated/)
                await scrollToStep(2)
                await expect(panels.nth(2)).toHaveAttribute('aria-hidden', 'false')
                await page.emulateMedia({reducedMotion: 'reduce'})
                await expect(scene).not.toHaveClass(/civic-scene--animated/)
                await expect(
                    scene.locator(
                        '.civic-scene__panel[inert], .civic-scene__panel[aria-hidden="true"]'
                    )
                ).toHaveCount(0)
                await expect(page.locator(`#resource-${ids[2]}`)).toBeInViewport()
                await page.setViewportSize({width: 390, height: 844})
                expect(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
                ).toBe(true)
                expect(errors).toEqual([])
            } finally {
                await browser.close()
            }
        })
    }
}

test('each featured preview opens its own original site', async ({page}) => {
    const destinations = [
        ['leurs-votes', 'https://www.leurs-votes.fr/'],
        ['monvote2027', 'https://monvote2027.fr/'],
        ['praxis', 'https://praxismedia.fr/liste-referendums/'],
        ['transparence', 'https://transparencecitoyenne.fr/'],
    ]
    for (const [id, url] of destinations) {
        await page.route(url, (route) =>
            route.fulfill({contentType: 'text/html', body: '<h1>Destination</h1>'})
        )
        await page.goto('/resources')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const link = page.locator(`#resource-${id} .civic-preview__link`)
        await expect(link).toHaveAttribute('href', url)
        await link.focus()
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(url)
    }
})
