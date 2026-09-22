import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    // Vercel's hosted measurement endpoints do not exist in a local static preview.
    await page.route('**/_vercel/**', (route) =>
        route.fulfill({status: 200, contentType: 'application/javascript', body: ''})
    )
})

const silenceLocalMeasurements = (context) =>
    context.route('**/_vercel/**', (route) =>
        route.fulfill({status: 200, contentType: 'application/javascript', body: ''})
    )

test('the neutral home follows the primary browser language', async ({browser}) => {
    for (const [locale, expectedPath, expectedLanguage] of [
        ['fr-CA', '/', 'fr'],
        ['en-GB', '/en', 'en'],
        ['de-DE', '/en', 'en'],
    ]) {
        const context = await browser.newContext({locale})
        await silenceLocalMeasurements(context)
        const page = await context.newPage()
        await page.goto('/')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await expect(page).toHaveURL(
            new RegExp(`${expectedPath === '/' ? '/$' : `${expectedPath}$`}`)
        )
        await expect(page.locator('html')).toHaveAttribute('lang', expectedLanguage)
        await context.close()
    }
})

test('an English entry never exposes the French prerender', async ({browser}) => {
    const context = await browser.newContext({locale: 'en-GB'})
    await silenceLocalMeasurements(context)
    let releaseScripts
    const scriptsCanLoad = new Promise((resolve) => {
        releaseScripts = resolve
    })
    await context.route('**/assets/*.js', async (route) => {
        await scriptsCanLoad
        await route.continue()
    })
    const page = await context.newPage()

    try {
        await page.goto('/', {waitUntil: 'commit'})
        const prerender = page.locator('#prerendered-content')
        await prerender.waitFor({state: 'attached'})
        await expect(page.locator('html')).toHaveAttribute('data-language-entry-pending', 'en')
        await expect(prerender).toBeHidden()
        releaseScripts()
        await prerender.waitFor({state: 'detached'})
        await expect(page).toHaveURL(/\/en$/)
    } finally {
        releaseScripts()
        await context.close()
    }
})

test('explicit URLs win and a manual home choice is remembered', async ({browser}) => {
    const context = await browser.newContext({locale: 'en-GB'})
    await silenceLocalMeasurements(context)
    const page = await context.newPage()

    await page.goto('/reflections')
    await expect(page).toHaveURL(/\/reflections$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await page.goto('/en')
    // The prerendered link navigates but only the hydrated switch remembers the choice.
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.getByRole('link', {name: 'Passer en français'}).click()
    await expect(page).toHaveURL(/\/$/)
    await page.goto('/en/reflections')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.goto('/')
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await context.close()
})

test('historical query links persist a choice without requiring storage', async ({browser}) => {
    const context = await browser.newContext({locale: 'fr-FR'})
    await silenceLocalMeasurements(context)
    const page = await context.newPage()
    await page.goto('/reflections?filter=essai&lang=en#articles')
    await expect(page).toHaveURL(/\/en\/reflections\?filter=essai#articles$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
    await context.close()

    const blockedContext = await browser.newContext({locale: 'de-DE'})
    await blockedContext.addInitScript(() => {
        Storage.prototype.getItem = () => {
            throw new DOMException('Blocked', 'SecurityError')
        }
        Storage.prototype.setItem = () => {
            throw new DOMException('Blocked', 'SecurityError')
        }
    })
    await silenceLocalMeasurements(blockedContext)
    const blockedPage = await blockedContext.newPage()
    await blockedPage.goto('/')
    await expect(blockedPage).toHaveURL(/\/en$/)
    await expect(blockedPage.locator('html')).toHaveAttribute('lang', 'en')
    await blockedContext.close()
})

test('the French prerender remains readable without JavaScript', async ({browser}) => {
    const context = await browser.newContext({javaScriptEnabled: false, locale: 'de-DE'})
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()
    await context.close()
})

test('language switches preserve the document, draft, scroll and browser history', async ({
    page,
}) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/#contact')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.getByRole('textbox', {name: 'Nom', exact: true}).fill('Draft preserved')
    const before = await page.evaluate(() => ({
        time: performance.timeOrigin,
        fieldTop: document.querySelector('#contact-name').getBoundingClientRect().top,
    }))
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveURL(/\/en#contact$/)
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(before.time)
    expect(
        Math.abs((await page.locator('#contact-name').boundingBox()).y - before.fieldTop)
    ).toBeLessThan(24)
    await expect(page.locator('#contact-name')).toHaveValue('Draft preserved')
    await page.goBack()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.locator('#contact-name')).toHaveValue('Draft preserved')
    expect(errors).toEqual([])
})

test('home actions remain clickable on desktop and the page fits a mobile viewport', async ({
    page,
}) => {
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const cv = page.getByRole('link', {name: 'Ouvrir le CV', exact: true})
    await cv.click()
    await expect(page).toHaveURL(/\/resume$/)
    const pdf = page.locator('a[href$=".pdf"]')
    await expect(pdf).toBeVisible()
    expect((await page.request.get(await pdf.getAttribute('href'))).status()).toBe(200)
    await page.setViewportSize({width: 390, height: 844})
    await page.goto('/')
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('Agora is presented as a private project intent in both languages', async ({page}) => {
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})

    const project = page.locator('.portfolio__intent')
    await expect(project.getByRole('heading', {name: 'Agora — Graphe des débats'})).toBeVisible()
    await expect(project.getByRole('link')).toHaveCount(0)
    await expect(project.locator('details')).not.toHaveAttribute('open', '')

    await project.getByText('Découvrir l’intention du projet').click()
    await expect(project.locator('details')).toHaveAttribute('open', '')
    await expect(project.getByText(/Un prototype local non publié/)).toBeVisible()

    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(project.getByRole('heading', {name: 'Agora — Debate graph'})).toBeVisible()
    await expect(project.getByText('New project · In development')).toBeVisible()
})

test('English articles have readable HTML without JavaScript', async ({browser}) => {
    const context = await browser.newContext({javaScriptEnabled: false})
    const page = await context.newPage()
    await page.goto('http://localhost:4173/en/reflections/charte-de-pensee')
    await expect(page.getByRole('heading', {level: 1})).toHaveText('Charter of thought')
    expect((await page.locator('.reflexion-article__content').innerText()).length).toBeGreaterThan(
        500
    )
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await context.close()
})

test('article navigation replaces structured data and unknown pages are noindex', async ({
    page,
}) => {
    await page.goto('/en/reflections/charte-de-pensee')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('script[data-seo-json-ld]')).toHaveCount(1)
    await page.locator('.reflexion-article__back').click()
    await expect(page).toHaveURL(/\/en\/reflections$/)
    await expect(page.locator('script[data-seo-json-ld]')).toHaveCount(0)
    await page.goto('/en/page-inconnue')
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
        'This page does not exist or is no longer available.'
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow'
    )
})

test('travel stories have clean, localized and backward-compatible URLs', async ({page}) => {
    await page.goto('/travel?trip=croatia-2026#stories')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('#travel-detail-title')).toHaveText('Dubrovnik')
    await expect(page.locator('.travel-timeline__item[aria-pressed=true]')).toContainText('2026')
    await expect(page).toHaveURL(/\/travel\/croatia-2026#stories$/)

    await page.goto('/travel')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page
        .locator('.travel-timeline__item', {hasText: 'Dubrovnik'})
        .filter({hasText: 'Juin 2026'})
        .click()
    await expect(page).toHaveURL(/\/travel\/croatia-2026#stories$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/travel$/)

    await page.goto('/en/travel/croatia-2026')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('#travel-detail-title')).toHaveText('Dubrovnik')
    await expect(page).toHaveTitle(/Dubrovnik, Croatia/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /\/og\/travel\/en\/croatia-2026\.png$/
    )
    await page.getByRole('link', {name: 'Passer en français'}).click()
    await expect(page).toHaveURL(/\/travel\/croatia-2026$/)

    await page.goto('/travel/voyage-inconnu')
    await expect(page.getByRole('heading', {level: 1})).toHaveText(
        'Cette page n’existe pas ou plus.'
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow'
    )
})

test('local contact uses the real API adapter without sending email', async ({page}) => {
    await page.goto('http://localhost:3101/#contact')
    await page.getByRole('textbox', {name: 'Nom', exact: true}).fill('Local Test')
    await page.getByRole('textbox', {name: 'Email', exact: true}).fill('test@example.com')
    await page
        .getByRole('textbox', {name: 'Message', exact: true})
        .fill('Un message de test local uniquement.')
    await page.getByRole('button', {name: 'Envoyer l’email'}).click()
    await expect(page.getByRole('status')).toContainText('Aucun email n’a été envoyé.')
})

test('home introduces the person before projects and opens selected localized stories', async ({
    page,
}) => {
    for (const path of ['/', '/en']) {
        await page.goto(path)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const order = await page
            .locator('#about, #portfolio, #home-reflections, #home-travel')
            .evaluateAll((nodes) => nodes.map((node) => node.id))
        expect(order).toEqual(['about', 'portfolio', 'home-reflections', 'home-travel'])
        for (const [before, after] of [
            ['#portfolio', '#home-reflections'],
            ['#home-reflections', '#home-travel'],
        ]) {
            const previous = await page.locator(before).boundingBox()
            const next = await page.locator(after).boundingBox()
            expect(next.y - previous.y - previous.height).toBeGreaterThanOrEqual(48)
        }
        const prefix = path === '/en' ? '/en' : ''
        const writing = page.locator('#home-reflections h3 a').first()
        await expect(writing).toHaveAttribute(
            'href',
            `${prefix}/reflections/mefiance-opposition-simple`
        )
        await writing.click()
        await expect(page.getByRole('heading', {level: 1})).toBeVisible()
        await page.goBack()
        await page.locator(`#home-travel a[href="${prefix}/travel/portugal-2025"]`).click()
        await expect(page).toHaveURL(new RegExp(`${prefix}/travel/portugal-2025$`))
    }
})

test('a Mapbox denial is explained while the selected story stays readable', async ({page}) => {
    await page.route('https://api.mapbox.com/**', (route) =>
        route.fulfill({status: 403, body: 'Forbidden'})
    )
    await page.goto('/travel/croatia-2021')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('.travel-mapbox__status')).toContainText(
        'Certaines données de la carte'
    )
    await expect(page.locator('#travel-detail-title')).toHaveText('Dubrovnik')
    await expect(page.getByRole('link', {name: 'Switch to English'})).toBeVisible()
})

test('project images open studies and the expanded Agora stays compact and aligned', async ({
    page,
}) => {
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const cards = page.locator('.portfolio__item')
    const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((n) => {
            const b = n.getBoundingClientRect()
            return {top: b.top, bottom: b.bottom}
        })
    )
    expect(
        Math.max(...boxes.map((b) => b.top)) - Math.min(...boxes.map((b) => b.top))
    ).toBeLessThan(1)
    expect(
        Math.max(...boxes.map((b) => b.bottom)) - Math.min(...boxes.map((b) => b.bottom))
    ).toBeLessThan(1)
    await expect(cards.nth(0).locator('a.portfolio__image')).toHaveAttribute(
        'href',
        '/projects/bruno-pizza'
    )
    await expect(cards.nth(1).locator('a.portfolio__image')).toHaveAttribute(
        'href',
        '/projects/my-website'
    )
    await expect(cards.nth(2).locator('a.portfolio__image')).toHaveCount(0)
    await page.locator('.portfolio__intent summary').click()
    // Read both rectangles in one frame: anchor settling can scroll between browser calls.
    const detailsGap = await page.locator('.portfolio__intent').evaluate((card) => {
        const summary = card.querySelector('summary').getBoundingClientRect()
        const first = card.querySelector('.portfolio__intent-grid section').getBoundingClientRect()
        return first.top - summary.bottom
    })
    expect(detailsGap).toBeLessThan(24)
    const order = await page
        .locator('#goals, #home-reflections, #home-travel, #contact')
        .evaluateAll((nodes) => nodes.map((n) => n.id))
    expect(order).toEqual(['goals', 'home-reflections', 'home-travel', 'contact'])
    await cards.nth(0).locator('a.portfolio__image').click()
    await expect(page).toHaveURL(/\/projects\/bruno-pizza$/)
})

test('home reading returns to its source section, including after a language switch', async ({
    page,
}) => {
    await page.goto('/#home-reflections')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('#home-reflections h3 a').first().click()
    await expect(page.locator('.reflexion-article__back')).toHaveAttribute(
        'href',
        '/#home-reflections'
    )
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await page.locator('.reflexion-article__back').click()
    await expect(page).toHaveURL(/\/en#home-reflections$/)
    await expect(page.locator('#home-reflections')).toBeInViewport()
    const carousel = page.locator('.home-travel-carousel')
    await expect(carousel.locator('a[href*="croatia-2021"]')).toHaveCount(0)
    await carousel.getByRole('button', {name: 'Guadeloupe'}).click()
    await carousel.getByRole('link', {name: 'Read this story'}).click()
    await expect(page).toHaveURL(/\/en\/travel\/guadeloupe-2025$/)
    await page.locator('.travel-timeline__back').click()
    await expect(page).toHaveURL(/\/en#home-travel$/)
    await expect(carousel.getByRole('button', {name: 'Guadeloupe'})).toHaveAttribute(
        'aria-pressed',
        'true'
    )
})

test('the About photo appears with the section on a large screen without scrolling', async ({
    page,
}) => {
    await page.setViewportSize({width: 2560, height: 1440})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect
        .poll(() => page.locator('.about__visual').evaluate((el) => getComputedStyle(el).opacity))
        .toBe('1')
    const visual = await page.locator('.about__visual').boundingBox()
    const cards = await page.locator('.about__cards').boundingBox()
    expect(Math.abs(visual.y - cards.y)).toBeLessThan(2)
    await expect(page.locator('.about__visual')).toBeInViewport()
    expect(await page.evaluate(() => scrollY)).toBe(0)
})

test('home titles stay concise in both languages and travel rotation can be paused', async ({
    page,
}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#home-travel')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page).toHaveTitle('Portfolio — Julien Esterbet')
    const carousel = page.locator('.home-travel-carousel')
    await carousel.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    await expect(carousel.getByRole('button', {name: 'Guadeloupe'})).toHaveAttribute(
        'aria-pressed',
        'true',
        {timeout: 10000}
    )
    await carousel.getByRole('button', {name: 'Mettre les voyages en pause'}).click()
    await expect(
        carousel.getByRole('button', {name: 'Reprendre le défilement des voyages'})
    ).toBeVisible()
    await page.getByRole('link', {name: 'Switch to English'}).click()
    await expect(page).toHaveTitle('Portfolio — Julien Esterbet')
    await expect(carousel.getByRole('button', {name: 'Resume travel slideshow'})).toBeVisible()
})

test('case study return restores the projects anchor after home layout settles', async ({page}) => {
    await page.goto('/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('a[href="/#portfolio"]').first().click()
    await expect(page).toHaveURL(/#portfolio$/)
    await expect
        .poll(async () => Math.abs((await page.locator('#portfolio').boundingBox()).y))
        .toBeLessThan(100)
    await page.waitForTimeout(2200)
    expect(Math.abs((await page.locator('#portfolio').boundingBox()).y)).toBeLessThan(100)
})
