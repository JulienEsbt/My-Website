import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const locale of ['fr', 'en']) {
        test(`mobile discovery and unrestricted reading in ${engine} ${locale}`, async () => {
            test.setTimeout(90000)
            const browser = await browserType.launch()
            try {
                const page = await browser.newPage({
                    viewport: {width: 393, height: 790},
                    isMobile: true,
                    hasTouch: true,
                    locale: `${locale}-${locale === 'fr' ? 'FR' : 'GB'}`,
                    reducedMotion: 'reduce',
                })
                const prefix = locale === 'fr' ? '' : '/en'
                const errors = []
                page.on('pageerror', (error) => errors.push(error.message))
                await page.goto(`http://localhost:4173/${locale === 'fr' ? '?lang=fr' : 'en'}`)
                await expect(page.locator('.mobile-home-entry')).toBeVisible()
                await expect(page.locator('.header-socials a[aria-label="LinkedIn"]')).toBeVisible()
                await expect(page.locator('.section-nav')).toBeVisible()
                await expect(page.locator('.section-nav__mobile-label').first()).toBeHidden()
                for (const width of [320, 393, 540, 700]) {
                    await page.setViewportSize({width, height: 790})
                    expect(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1
                        )
                    ).toBe(true)
                }
                await page.setViewportSize({width: 393, height: 790})
                await page.goto(`http://localhost:4173${prefix}/resources`)
                for (const id of ['selection']) {
                    const deck = page.locator(`#${id} .mobile-deck`)
                    await expect(deck.locator('.mobile-deck__controls')).toHaveCount(0)
                    // With reduced motion, keep native horizontal swiping and full-list reading.
                    await deck.locator('.mobile-deck__track').evaluate((el) => {
                        el.scrollLeft = el.children[1].offsetLeft - el.children[0].offsetLeft
                    })
                    const second = deck.locator('.civic-card').nth(1)
                    await second
                        .locator('summary')
                        .evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}))
                    await second.locator('summary').click()
                    await expect(second.locator('.civic-card__mobile-context')).toBeVisible()
                    expect(
                        await second.evaluate((el) => el.scrollHeight <= el.clientHeight + 2)
                    ).toBe(true)
                    const show = deck.getByRole('button', {
                        name: locale === 'fr' ? 'Tout afficher' : 'Show all',
                    })
                    await show.evaluate((el) =>
                        el.scrollIntoView({block: 'center', behavior: 'instant'})
                    )
                    await show.click()
                    await expect(deck.locator('.mobile-deck__track')).toHaveCSS(
                        'overflow-x',
                        'visible'
                    )
                    await expect(deck.locator('.civic-card')).toHaveCount(4)
                }
                await page.emulateMedia({reducedMotion: 'no-preference'})
                await expect(
                    page.locator('.civic-scene--animated,.civic-mobile-scene--animated')
                ).toHaveCount(0)
                await page.goto(`http://localhost:4173${prefix}/travel`)
                await expect(page.locator('#travel-explorer')).toHaveCount(0)
                const map = page.locator('#mobile-travel-map > summary')
                await map.evaluate((el) =>
                    el.scrollIntoView({block: 'center', behavior: 'instant'})
                )
                await map.click()
                await expect(page.locator('#travel-explorer')).toBeVisible()
                expect(await page.locator('.travel-timeline__cover').count()).toBe(
                    await page.locator('.travel-timeline__item').count()
                )
                await page.setViewportSize({width: 844, height: 390})
                await expect(page.locator('#mobile-travel-map')).toHaveCount(0)
                await expect(page.locator('#travel-explorer')).toHaveCount(1)
                expect(
                    await page.evaluate(
                        () => document.documentElement.scrollWidth <= innerWidth + 1
                    )
                ).toBe(true)
                expect(errors).toEqual([])
            } finally {
                await browser.close()
            }
        })
    }
}

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    test(`phone and intermediate widths keep every page readable in ${engine}`, async () => {
        test.setTimeout(120000)
        const browser = await browserType.launch()
        try {
            const page = await browser.newPage({locale: 'fr-FR', reducedMotion: 'reduce'})
            const errors = []
            page.on('pageerror', (error) => errors.push(error.message))
            for (const viewport of [
                {width: 320, height: 568},
                {width: 430, height: 932},
                {width: 600, height: 800},
                {width: 844, height: 390},
            ]) {
                await page.setViewportSize(viewport)
                for (const route of [
                    '/?lang=fr',
                    '/web3',
                    '/travel',
                    '/reflections',
                    '/resources',
                    '/projects/bruno-pizza',
                    '/reflections/mefiance-opposition-simple',
                ]) {
                    await page.goto(`http://localhost:4173${route}`)
                    await page.locator('#prerendered-content').waitFor({state: 'detached'})
                    await expect(page.locator('main h1').first()).toBeVisible()
                    expect(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1
                        ),
                        `${route} at ${viewport.width}`
                    ).toBe(true)
                }
            }
            await page.setViewportSize({width: 393, height: 790})
            await page.goto('http://localhost:4173/resources#resource-madada')
            await expect(page.locator('#further .mobile-accordion__item').last()).toHaveAttribute(
                'open',
                ''
            )
            await expect(page.locator('#resource-madada')).toBeInViewport()
            expect(errors).toEqual([])
        } finally {
            await browser.close()
        }
    })
}
