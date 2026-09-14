import {test, expect} from '@playwright/test'
test.beforeEach(async ({page}) => {
    await page.route('**/_vercel/**', (route) => route.fulfill({status: 200, body: ''}))
})
test('six trips fill their photo frame and keep Tallinn last', async ({page}) => {
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const carousel = page.locator('.home-travel-carousel')
    await carousel.scrollIntoViewIfNeeded()
    const buttons = carousel.locator('.home-travel-carousel__destinations button')
    await expect(buttons).toHaveCount(6)
    await expect(buttons.last()).toContainText('Estonie')
    for (let i = 0; i < 6; i++) {
        await buttons.nth(i).click()
        await expect(carousel.locator('img')).toHaveCSS('object-fit', 'cover')
        await expect
            .poll(() =>
                carousel.locator('img').evaluate((img) => img.complete && img.naturalWidth > 0)
            )
            .toBe(true)
        await expect(carousel.locator('img')).toHaveCSS('padding-top', '0px')
        await carousel
            .locator('.home-discover__photo')
            .screenshot({path: `/tmp/travel-crop-${i}.png`})
    }
    await page.screenshot({path: '/tmp/portfolio-travel-desktop.png'})
    await page.setViewportSize({width: 390, height: 844})
    await carousel.scrollIntoViewIfNeeded()
    await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
    await page.screenshot({path: '/tmp/portfolio-travel-mobile.png'})
})
test('reflection card title opens the article and text selection publishes through the API', async ({
    page,
}) => {
    let comments = []
    await page.route('**/api/comments?**', async (route) => {
        if (route.request().method() === 'POST') {
            const input = route.request().postDataJSON()
            const comment = {...input, id: 'test-id', createdAt: new Date().toISOString()}
            comments = [comment]
            return route.fulfill({json: {comment, deleteToken: 'test-delete'}})
        }
        if (route.request().method() === 'DELETE') {
            comments = []
            return route.fulfill({json: {ok: true}})
        }
        return route.fulfill({json: {comments, hasMore: false}})
    })
    await page.goto('/reflections')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('.reflexion-card').first().locator('h3').click()
    const content = page.locator('.reflexion-article__content')
    await expect(content).toBeVisible()
    await content.locator('p').first().scrollIntoViewIfNeeded()
    await content
        .locator('p')
        .first()
        .evaluate((p) => {
            const range = document.createRange()
            range.selectNodeContents(p)
            const s = window.getSelection()
            s.removeAllRanges()
            s.addRange(range)
        })
    await page.getByRole('button', {name: 'Commenter ce passage', exact: true}).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByLabel('Pseudonyme').fill('Camille')
    await dialog.getByLabel('Ton commentaire').fill('Une autre manière de lire ce passage.')
    await dialog.getByRole('button', {name: 'Publier', exact: true}).click()
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('.reader-comments__item')).toContainText('Camille')
    await page.getByRole('button', {name: 'Retirer ce commentaire', exact: true}).click()
    await expect(page.locator('.reader-comments__item')).toHaveCount(0)
})
test('unconfigured comments cannot pretend to publish', async ({page}) => {
    await page.route('**/api/comments?**', (route) =>
        route.fulfill({status: 503, json: {code: 'not_configured'}})
    )
    await page.goto('/reflections/charte-de-pensee')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.getByRole('button', {name: 'Commenter la réflexion', exact: true}).click()
    await expect(
        page.getByRole('dialog').getByRole('button', {name: 'Publier', exact: true})
    ).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
})
test('production story respects motion preferences and scrolls natively', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const story = page.locator('.production-story')
    await story.scrollIntoViewIfNeeded()
    await expect(story.locator('.production-story__step')).toHaveCount(3)
    await expect(story.locator('.production-story__visual')).toHaveCSS('position', 'sticky')
    await story.locator('.production-story__step').last().scrollIntoViewIfNeeded()
    await page.screenshot({path: '/tmp/portfolio-production-story.png'})
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(story.locator('.production-story__visual')).toHaveCSS('position', 'static')
})

test('additional scroll stories preserve content and simplify on mobile', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.setViewportSize({width: 1440, height: 1000})
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('#about').scrollIntoViewIfNeeded()
    await expect(page.locator('.about__visual')).toHaveCSS('position', 'sticky')
    await expect(page.locator('.about__visual img')).toBeVisible()
    await page.screenshot({path: '/tmp/about-scroll.png'})
    await page.goto('/projects/my-website')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const story = page.locator('.production-story')
    await expect(story.locator('.production-story__step')).toHaveCount(3)
    await story.locator('.production-story__step').nth(1).scrollIntoViewIfNeeded()
    await expect(story).not.toContainText('website.solution.')
    await page.screenshot({path: '/tmp/website-scroll.png'})
    await page.setViewportSize({width: 390, height: 844})
    await expect(story.locator('.production-story__visual')).toHaveCSS('position', 'static')
    await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(story.locator('.production-story__step').first()).toHaveCSS('transform', 'none')
})

test('dock labels are contextual and professional chapters remain readable', async ({page}) => {
    await page.setViewportSize({width: 1440, height: 1000})
    await page.emulateMedia({reducedMotion: 'reduce'})
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('#portfolio').scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const active = page.locator('.section-nav a[data-label="Projets"]')
    await expect
        .poll(() => active.evaluate((el) => getComputedStyle(el, '::after').opacity))
        .toBe('0')
    await active.hover()
    await expect
        .poll(() => active.evaluate((el) => getComputedStyle(el, '::after').opacity))
        .toBe('1')
    await page.mouse.move(0, 0)
    await expect
        .poll(() => active.evaluate((el) => getComputedStyle(el, '::after').opacity))
        .toBe('0')
    await page.emulateMedia({reducedMotion: 'no-preference'})
    for (const section of ['experience', 'services']) {
        await page.locator(`#${section}`).scrollIntoViewIfNeeded()
        await expect(page.locator(`#${section} .professional-chapter__heading`)).toHaveCSS(
            'position',
            'sticky'
        )
        await page.screenshot({path: `/tmp/chapters-${section}.png`})
    }
    await page.locator('#about').scrollIntoViewIfNeeded()
    expect((await page.locator('.about__visual').boundingBox()).width).toBeGreaterThan(350)
    await page.screenshot({path: '/tmp/chapters-about.png'})
    await page.setViewportSize({width: 390, height: 844})
    await page.locator('#services').scrollIntoViewIfNeeded()
    await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
    await page.screenshot({path: '/tmp/chapters-mobile.png'})
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(page.locator('#services .professional-chapter__heading')).toHaveCSS(
        'position',
        'static'
    )
})

test('competency evidence keeps the language and opens the relevant case section', async ({
    page,
}) => {
    for (const prefix of ['', '/en']) {
        await page.goto(prefix || '/')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const proofs = page.locator('.experience__proof')
        await expect(proofs).toHaveCount(3)
        await expect(proofs.nth(0)).toHaveAttribute(
            'href',
            `${prefix}/projects/my-website#solution`
        )
        await expect(proofs.nth(1)).toHaveAttribute(
            'href',
            `${prefix}/projects/bruno-pizza#architecture`
        )
        await proofs.nth(1).click()
        await expect(page.locator('#architecture')).toBeVisible()
        await expect(page).toHaveURL(new RegExp(`${prefix}/projects/bruno-pizza#architecture$`))
    }
})

test('professional chapters keep the centered title pinned while cards progress', async ({
    page,
}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    for (const size of [
        {width: 1440, height: 900},
        {width: 1920, height: 1080},
    ]) {
        await page.setViewportSize(size)
        for (const id of ['experience', 'services']) {
            const section = page.locator(`#${id}`)
            const heading = section.locator('.professional-chapter__heading')
            await section.scrollIntoViewIfNeeded()
            await page.evaluate(() => document.fonts.ready)
            const geometry = await section.evaluate((el) => {
                const h = el.querySelector('.professional-chapter__heading')
                return {
                    top: el.getBoundingClientRect().top + scrollY,
                    height: el.offsetHeight,
                    headingHeight: h.offsetHeight,
                    inset: parseFloat(getComputedStyle(h).top),
                }
            })
            const range = geometry.height - geometry.headingHeight
            expect(range).toBeGreaterThan(150)
            for (const progress of [0.2, 0.7]) {
                await page.evaluate(
                    (y) => scrollTo({top: y, behavior: 'instant'}),
                    geometry.top - geometry.inset + range * progress
                )
                await expect
                    .poll(async () => Math.abs((await heading.boundingBox()).y - geometry.inset))
                    .toBeLessThan(3)
                // Overlapping panels must stay opaque: fading the whole card mixes their text.
                for (const card of await section
                    .locator('.professional-chapter__step > article')
                    .all()) {
                    await expect(card).toHaveCSS('opacity', '1')
                }
                const box = await heading.boundingBox()
                expect(Math.abs(box.y + box.height / 2 - size.height / 2)).toBeLessThan(3)
            }
            // At 70% the first panels overlap intentionally, while sharing the heading's inset.
            const panels = await section
                .locator('.professional-chapter__step')
                .evaluateAll((steps) =>
                    steps.map((step) => {
                        const rect = step.getBoundingClientRect()
                        return {top: rect.top, bottom: rect.bottom}
                    })
                )
            expect(Math.abs(panels[0].top - geometry.inset)).toBeLessThan(3)
            expect(panels[1].top).toBeLessThan(panels[0].bottom)
            // Both columns must leave together once the sticky sequence ends.
            await page.evaluate(
                (y) => scrollTo({top: y, behavior: 'instant'}),
                geometry.top - geometry.inset + range + 40
            )
            await expect
                .poll(async () => {
                    const title = await heading.boundingBox()
                    const last = await section
                        .locator('.professional-chapter__step')
                        .last()
                        .boundingBox()
                    return Math.abs(title.y - last.y)
                })
                .toBeLessThan(3)
            await page.screenshot({path: `/tmp/restored-${id}-${size.width}.png`})
        }
    }
})

test('chapter progress updates after a fresh production load without resizing', async ({page}) => {
    await page.setViewportSize({width: 1440, height: 900})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#experience')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.evaluate(() => document.fonts.ready)
    for (const id of ['experience', 'services']) {
        const section = page.locator(`#${id}`)
        const content = section.locator('.professional-chapter__heading-content')
        const geometry = await section.evaluate((el) => ({
            top: el.getBoundingClientRect().top + scrollY,
            height: el.offsetHeight,
            inset: parseFloat(
                getComputedStyle(el.querySelector('.professional-chapter__heading')).top
            ),
        }))
        const start = geometry.top - geometry.inset
        const end = geometry.top + geometry.height - 450
        for (const progress of [0.15, 0.75, 0.3]) {
            await page.evaluate(
                (y) => scrollTo({top: y, behavior: 'instant'}),
                start + (end - start) * progress
            )
            await expect
                .poll(() =>
                    content.evaluate((el) =>
                        Number(getComputedStyle(el).getPropertyValue('--chapter-progress'))
                    )
                )
                .toBeCloseTo(0.05 + 0.95 * progress, 1)
        }
    }
})

test('travel slideshow advances over the photo and can be paused', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#home-travel')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const carousel = page.locator('.home-travel-carousel')
    await carousel.scrollIntoViewIfNeeded()
    await carousel.locator('.home-discover__photo').hover()
    const selected = carousel.locator('[aria-pressed="true"]')
    const initial = await selected.innerText()
    await expect(selected).not.toHaveText(initial, {timeout: 10000})
    await carousel.getByRole('button', {name: 'Mettre les voyages en pause'}).click()
    const paused = await selected.innerText()
    await page.waitForTimeout(6500)
    await expect(selected).toHaveText(paused)
})
