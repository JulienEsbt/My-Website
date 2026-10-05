import {test, expect, chromium, webkit} from '@playwright/test'

for (const viewport of [
    {width: 393, height: 790},
    {width: 1280, height: 720},
    {width: 1440, height: 800},
    {width: 1710, height: 980},
    {width: 1920, height: 1080},
    {width: 2560, height: 1440},
]) {
    test(`site layouts remain readable at ${viewport.width}px`, async ({page}) => {
        test.setTimeout(120000)
        await page.setViewportSize(viewport)
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        for (const route of [
            '/',
            '/web3',
            '/travel',
            '/reflections',
            '/resources',
            '/projects/bruno-pizza',
            '/projects/my-website',
            '/resume',
            '/privacy',
        ]) {
            await page.goto(route)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            await expect(page.locator('main h1').first()).toBeVisible()
            await page.evaluate(() => document.fonts.ready)
            expect(
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
                route
            ).toBe(true)
            if (
                ['/', '/web3', '/travel', '/reflections', '/resources'].includes(route) &&
                viewport.width >= 1100
            ) {
                const hero = page.locator('.entry-screen .container').first()
                const bounds = await hero.boundingBox()
                expect(Math.abs(bounds.x + bounds.width / 2 - viewport.width / 2)).toBeLessThan(2)
                await expect
                    .poll(
                        async () => {
                            const rect = await hero.boundingBox()
                            const bottom = await page
                                .locator('#main')
                                .evaluate((el) =>
                                    parseFloat(
                                        getComputedStyle(el).getPropertyValue('--scene-bottom')
                                    )
                                )
                            return rect.height <= viewport.height - 96 - bottom
                                ? Math.abs(
                                      rect.y + rect.height / 2 - (96 + viewport.height - bottom) / 2
                                  )
                                : 0
                        },
                        {message: `${route} centered after fonts and entrance settle`}
                    )
                    .toBeLessThan(4)
                await page.screenshot({
                    path: `/tmp/center-${route === '/' ? 'home' : route.slice(1)}-${viewport.width}.png`,
                })
            }
        }
        expect(errors).toEqual([])
    })
}

// Browser zoom changes the CSS viewport, independently of the panel's physical
// resolution. These cases exercise the resulting layout, not a CSS transform.
const desktopViewports = [
    {width: 1025, height: 650},
    {width: 1180, height: 700},
    {width: 1181, height: 700},
    {width: 1280, height: 720},
    {width: 1366, height: 650},
    {width: 1439, height: 800},
    {width: 1440, height: 800},
    {width: 1512, height: 850},
    {width: 1599, height: 900},
    {width: 1600, height: 900},
    {width: 1710, height: 980},
    {width: 1920, height: 1080},
    {width: 2560, height: 1440},
]
const zoomViewports = [1.25, 1.5, 2].map((zoom) => ({
    width: Math.round(1440 / zoom),
    height: Math.round(900 / zoom),
}))

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`hero content stays inside the screen across laptop sizes and zoom layouts in ${engine}`, async () => {
        test.setTimeout(120000)
        const browser = await browserType.launch()
        const context = await browser.newContext({
            locale: 'fr-FR',
            reducedMotion: 'reduce',
            deviceScaleFactor: 2,
        })
        await context.route('**/_vercel/**', (route) => route.fulfill({status: 200, body: ''}))
        const page = await context.newPage()
        try {
            for (const route of ['/', '/web3']) {
                await page.goto(`http://localhost:4173${route}`)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                await page.evaluate(() => document.fonts.ready)
                for (const viewport of [
                    ...desktopViewports,
                    ...zoomViewports,
                    {width: 320, height: 568},
                ]) {
                    await page.setViewportSize(viewport)
                    const hero = page
                        .locator('main > header, main header.home-hero, main .hero')
                        .first()
                    await expect(hero).toBeVisible()
                    const label = `${route} ${viewport.width}x${viewport.height}`
                    // A clipped absolute child does not affect document.scrollWidth.
                    // Check actual text, links and portrait badges against the viewport.
                    const readClipping = () =>
                        hero
                            .locator(
                                'h1, p, a, .home-hero__eyebrow, .home-hero__floating-pill, .me__meta, .me__chain'
                            )
                            .evaluateAll((elements) =>
                                elements.flatMap((el) => {
                                    const r = el.getBoundingClientRect()
                                    if (
                                        !r.width ||
                                        !r.height ||
                                        getComputedStyle(el).visibility === 'hidden'
                                    )
                                        return []
                                    return r.left < -1 || r.right > innerWidth + 1
                                        ? [
                                              {
                                                  text: el.textContent.trim().slice(0, 70),
                                                  left: r.left,
                                                  right: r.right,
                                              },
                                          ]
                                        : []
                                })
                            )
                    // WebKit applies viewport changes asynchronously. Assert the settled
                    // layout, as Playwright does for pointer actionability below.
                    await expect.poll(readClipping, {message: label}).toEqual([])
                    for (const link of await hero.locator('.cta a, .header-socials a').all()) {
                        if (!(await link.isVisible())) continue
                        // Pointer actionability waits for WebKit's asynchronous resize/scroll
                        // and checks hit-testing without opening these external destinations.
                        await link.click({trial: true})
                    }
                    await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}))
                    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
                    if ([1280, 1440, 1710, 2560, 960].includes(viewport.width)) {
                        await page.screenshot({
                            path: `/tmp/responsive-${engine}-${route === '/' ? 'home' : 'web3'}-${viewport.width}.png`,
                            scale: 'css',
                        })
                    }
                }
            }
        } finally {
            await browser.close()
        }
    })
}

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`social links stay clear of the hero actions after animated resizing in ${engine}`, async () => {
        const browser = await browserType.launch()
        const context = await browser.newContext({
            viewport: {width: 1710, height: 980},
            locale: 'fr-FR',
            reducedMotion: 'no-preference',
        })
        const page = await context.newPage()
        try {
            await page.goto('http://localhost:4173/')
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const socials = page.locator('.home-hero__socials-wrapper')
            await expect(socials.locator('.header-socials')).toHaveCSS('opacity', '1')
            for (const width of [1280, 1440, 1181, 1710]) {
                await page.setViewportSize({width, height: 800})
                await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}))
                const rail = await socials.boundingBox()
                expect(rail.x).toBeGreaterThanOrEqual(0)
                expect(rail.x + rail.width).toBeLessThanOrEqual(width)
                const actions = await page.locator('.home-hero .cta').boundingBox()
                if (width < 1440) {
                    expect(rail.y).toBeGreaterThanOrEqual(actions.y + actions.height + 16)
                } else {
                    expect(rail.x + rail.width).toBeLessThanOrEqual(actions.x)
                }
            }
        } finally {
            await browser.close()
        }
    })
}

// Guard against an optically tiny layout that still passes overflow checks.
test('all five introductions grow on large displays and keep a complete first screen in both languages', async ({
    page,
}) => {
    test.setTimeout(120000)
    for (const locale of ['', '/en']) {
        for (const route of ['/', '/web3', '/travel', '/reflections', '/resources']) {
            const sizes = []
            for (const viewport of [
                {width: 1440, height: 900},
                {width: 2560, height: 1440},
            ]) {
                await page.setViewportSize(viewport)
                await page.goto(`${locale}${route}`)
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                await expect(page.locator('.entry-screen h1')).toBeVisible()
                await page.evaluate(() => document.fonts.ready)
                const entry = await page.locator('.entry-screen').evaluate((el) => {
                    const content = el.querySelector('.container').getBoundingClientRect()
                    return {
                        width: content.width,
                        top: content.top,
                        bottom: content.bottom,
                        end: el.getBoundingClientRect().bottom,
                        title: parseFloat(getComputedStyle(el.querySelector('h1')).fontSize),
                        reserve: parseFloat(
                            getComputedStyle(el).getPropertyValue('--scene-bottom')
                        ),
                    }
                })
                const label = `${locale}${route} ${viewport.width}`
                expect(entry.end, label).toBeGreaterThanOrEqual(viewport.height - 1)
                expect(entry.top, label).toBeGreaterThanOrEqual(95)
                expect(entry.bottom, label).toBeLessThanOrEqual(viewport.height - entry.reserve + 1)
                expect(entry.width / viewport.width, label).toBeGreaterThan(0.7)
                sizes.push(entry)
            }
            expect(sizes[1].width / sizes[0].width, `${locale}${route} width`).toBeGreaterThan(1.5)
            expect(sizes[1].title / sizes[0].title, `${locale}${route} title`).toBeGreaterThan(1.4)
        }
    }
})

test('editorial entry cards open the selected story and note in the current language', async ({
    page,
}) => {
    for (const prefix of ['', '/en']) {
        await page.goto(`${prefix}/travel`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await page.locator('.travel-entry-photo').click()
        await expect(page).toHaveURL(new RegExp(`${prefix}/travel/portugal-2025#stories$`))
        await expect(page.locator('#travel-detail-title')).toHaveText(
            prefix ? 'Lisbon' : 'Lisbonne'
        )
        await page.goto(`${prefix}/reflections`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const note = page.locator('.reflection-entry-note')
        const title = await note.locator('h2').innerText()
        await note.click()
        await expect(page).toHaveURL(
            new RegExp(`${prefix}/reflections/mefiance-opposition-simple$`)
        )
        await expect(page.locator('main h1')).toHaveText(title)
    }
})

test('editorial first-screen statistics clear the dock on shallow laptops', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 720})
    for (const prefix of ['', '/en']) {
        for (const route of ['/travel', '/reflections']) {
            await page.goto(`${prefix}${route}`)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            await page.evaluate(() => document.fonts.ready)
            await expect
                .poll(() =>
                    page.locator('.page-hero__footer').evaluate((el) => {
                        const dock = document.querySelector('nav.section-nav')
                        return dock.getBoundingClientRect().top - el.getBoundingClientRect().bottom
                    })
                )
                .toBeGreaterThanOrEqual(19)
            await page.screenshot({
                path: `/tmp/entry-${prefix ? 'en' : 'fr'}-${route.slice(1)}-1280.png`,
            })
        }
    }
})

// The capsule is part of the centered group, not a separate viewport rail.
test('portfolio centers the visible social, copy and portrait composition', async ({page}) => {
    for (const viewport of [
        {width: 1440, height: 900},
        {width: 1710, height: 980},
        {width: 2560, height: 1440},
    ]) {
        await page.setViewportSize(viewport)
        await page.goto('/')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await page.evaluate(() => document.fonts.ready)
        await expect
            .poll(() =>
                page.locator('.home-hero__container').evaluate((el) => {
                    const items = [
                        ...el.querySelectorAll(
                            '.header-socials, .home-hero__copy, .home-hero__portrait-card, .home-hero__floating-pill'
                        ),
                    ].map((node) => node.getBoundingClientRect())
                    const left = Math.min(...items.map((r) => r.left))
                    const right = Math.max(...items.map((r) => r.right))
                    return Math.abs((left + right) / 2 - innerWidth / 2)
                })
            )
            .toBeLessThan(3)
    }
})

test('travel introduction offers six selectable stories with localized links', async ({page}) => {
    for (const prefix of ['', '/en']) {
        await page.setViewportSize({width: 393, height: 790})
        await page.goto(`${prefix}/travel`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const carousel = page.locator('.travel-entry-carousel')
        const choices = carousel.locator('.travel-entry-carousel__dots button')
        await expect(choices).toHaveCount(6)
        for (let index = 0; index < 6; index++) {
            await choices.nth(index).click()
            await expect(choices.nth(index)).toHaveAttribute('aria-pressed', 'true')
            await expect(carousel.locator('.travel-entry-photo img')).toBeVisible()
        }
        await carousel
            .getByRole('button', {name: prefix ? 'Next trip' : 'Voyage suivant', exact: true})
            .click()
        await expect(carousel.locator('.travel-entry-photo')).toHaveAttribute(
            'href',
            `${prefix}/travel/portugal-2025#stories`
        )
        await choices.nth(1).click()
        await carousel.locator('.travel-entry-photo').click()
        await expect(page).toHaveURL(new RegExp(`${prefix}/travel/guadeloupe-2025#stories$`))
        await expect(page.locator('#travel-detail-title')).toBeVisible()
    }
})
