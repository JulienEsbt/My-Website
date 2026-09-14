import {test, expect} from '@playwright/test'

test('chapter handoff stays centered, reverses and restores full readability', async ({page}) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({width: 1440, height: 900})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const bounds = await page.evaluate(() => {
        const a = document.getElementById('experience')
        const b = document.getElementById('services')
        const height = (el) => parseFloat(getComputedStyle(el).getPropertyValue('--stage-height'))
        return {
            start:
                a.offsetTop +
                a.offsetHeight -
                height(a) -
                Math.max(80, (innerHeight - height(a)) / 2),
            end: b.offsetTop - Math.max(80, (innerHeight - height(b)) / 2),
        }
    })
    const outgoing = page.locator('#experience .professional-chapter__heading')
    const proof = page
        .locator('#experience .professional-chapter__step')
        .last()
        .locator('.experience__proof')
    const incoming = page.locator('#services .professional-chapter__heading')
    await page.evaluate((y) => scrollTo(0, y), bounds.end + 10)
    await expect(incoming).toHaveCSS('opacity', '1')
    await expect(page.locator('#experience .professional-chapter__step').last()).toHaveCSS(
        'opacity',
        '0'
    )
    await page.evaluate((y) => scrollTo(0, y), bounds.start + (bounds.end - bounds.start) * 0.5)
    await expect(incoming).toHaveCSS('opacity', '1')
    await expect(outgoing).toHaveCSS('opacity', '1')
    await expect(incoming).toHaveCSS('clip-path', 'none')
    await expect(outgoing).toHaveCSS('clip-path', 'none')
    await expect(proof).toHaveCSS('opacity', '1')
    await expect(proof).toHaveCSS('visibility', 'visible')
    const followingCards = page.locator('#services .professional-chapter__step')
    await expect(followingCards.nth(1)).toHaveCSS('transform', 'none')
    await expect(followingCards.nth(2)).toHaveCSS('transform', 'none')
    await page.evaluate((y) => scrollTo(0, y), bounds.start - 10)
    await expect(outgoing).toHaveCSS('opacity', '1')
    await expect(incoming).toHaveCSS('visibility', 'hidden')
    await expect(proof).toHaveCSS('opacity', '1')
    await expect(proof).toHaveCSS('visibility', 'visible')
    for (const card of await page.locator('#experience .professional-chapter__step').all()) {
        await expect(card).toHaveCSS('mask-image', 'none')
    }
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(incoming).toHaveCSS('opacity', '1')
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.setViewportSize({width: 900, height: 900})
    await expect(incoming).toBeVisible()
    await page.setViewportSize({width: 1440, height: 900})
    await expect(incoming).toBeAttached()
    expect(errors).toEqual([])
})

for (const width of [1440, 2560]) {
    test(`handoff survives repeated reversals and resizing at ${width}px`, async ({page}) => {
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setViewportSize({width, height: 1000})
        await page.emulateMedia({reducedMotion: 'no-preference'})
        await page.goto('http://localhost:3101/')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await page
            .locator('#services .professional-chapter__step')
            .last()
            .waitFor({state: 'attached'})
        await page.evaluate(() => document.fonts.ready)
        const bounds = await page.evaluate(() => {
            const a = document.getElementById('experience')
            const b = document.getElementById('services')
            const height = (el) =>
                parseFloat(getComputedStyle(el).getPropertyValue('--stage-height'))
            return {
                start:
                    a.offsetTop +
                    a.offsetHeight -
                    height(a) -
                    Math.max(80, (innerHeight - height(a)) / 2),
                end: b.offsetTop - Math.max(80, (innerHeight - height(b)) / 2),
                height: height(b),
            }
        })
        const oldCards = page.locator('#experience .professional-chapter__step')
        for (const fraction of [0.7, 0.2, 1.1, 0.4, -0.1, 0.8, 0.1, 1.05]) {
            await page.evaluate(
                ({bounds, fraction}) =>
                    scrollTo(0, bounds.start + (bounds.end - bounds.start) * fraction),
                {bounds, fraction}
            )
            if (fraction > 0) {
                await expect(oldCards.nth(0)).toHaveCSS('visibility', 'hidden')
                await expect(oldCards.nth(1)).toHaveCSS('visibility', 'hidden')
            }
        }
        await page.evaluate((y) => scrollTo(0, y), bounds.end + bounds.height + 20)
        const last = page.locator('#services .professional-chapter__step').last()
        await expect
            .poll(() => last.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42))
            .toBe(0)
        await page.evaluate((y) => scrollTo(0, y), bounds.start - 20)
        await expect(oldCards.first()).toHaveCSS('visibility', 'visible')
        await expect(oldCards.first()).toHaveCSS('mask-image', 'none')
        await page.setViewportSize({width: 800, height: 1000})
        await expect(last).toHaveCSS('transform', 'none')
        await page.setViewportSize({width, height: 1000})
        await page.emulateMedia({reducedMotion: 'reduce'})
        await expect(last).toHaveCSS('transform', 'none')
        await expect(page.locator('#experience')).toBeVisible()
        expect(errors).toEqual([])
    })
}
