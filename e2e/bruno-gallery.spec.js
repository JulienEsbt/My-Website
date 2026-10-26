import {test, expect} from '@playwright/test'

test('ten full-resolution captures, navigation and mobile layout', async ({browser}) => {
    const context = await browser.newContext({
        viewport: {width: 1920, height: 1200},
        deviceScaleFactor: 2,
        reducedMotion: 'reduce',
        locale: 'fr-FR',
    })
    const page = await context.newPage()
    await page.goto('http://localhost:4173/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const gallery = page.locator('.bruno-gallery')
    await gallery.scrollIntoViewIfNeeded()
    await expect(gallery.locator('.bruno-gallery__thumbnails button')).toHaveCount(10)
    await expect
        .poll(() =>
            gallery
                .locator('.bruno-gallery__screen img')
                .evaluate((img) => img.complete && img.currentSrc.includes('3420'))
        )
        .toBe(true)
    await page.screenshot({path: '/tmp/bruno-gallery-retina.png'})
    for (let i = 0; i < 10; i++) {
        await gallery.locator('.bruno-gallery__thumbnails button').nth(i).click()
        await expect
            .poll(() =>
                gallery
                    .locator('.bruno-gallery__screen img')
                    .evaluate((img) => img.complete && img.naturalWidth > 0)
            )
            .toBe(true)
        await expect(gallery.locator('.bruno-gallery__caption span')).toHaveText(
            `${String(i + 1).padStart(2, '0')} / 10`
        )
    }
    await gallery.getByRole('button', {name: 'Capture suivante', exact: true}).click()
    await expect(gallery.locator('.bruno-gallery__caption span')).toHaveText('01 / 10')
    await expect(gallery.getByRole('link', {name: /pleine résolution/})).toHaveAttribute(
        'href',
        /3420.*webp/
    )
    await page.setViewportSize({width: 393, height: 852})
    await gallery.scrollIntoViewIfNeeded()
    await page.screenshot({path: '/tmp/bruno-gallery-mobile.png'})
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.goto('http://localhost:4173/en/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.getByRole('button', {name: 'Next screenshot', exact: true})).toBeVisible()
    await context.close()
})

test('autoplay advances, pauses explicitly and remains stopped with reduced motion', async ({
    page,
}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const gallery = page.locator('.bruno-gallery')
    await gallery.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    await expect(gallery.locator('.bruno-gallery__caption span')).not.toHaveText('01 / 10', {
        timeout: 10000,
    })
    await gallery.getByRole('button', {name: 'Mettre le diaporama en pause'}).click()
    await expect(gallery.getByRole('button', {name: 'Lancer le diaporama'})).toBeVisible()
    const current = await gallery.locator('.bruno-gallery__caption span').textContent()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(7000)
    await expect(gallery.locator('.bruno-gallery__caption span')).toHaveText(current)
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(gallery.getByRole('button', {name: 'Lancer le diaporama'})).not.toBeVisible()
})

test('Bruno Pizza presents the v1.2 changes and separates Windows validation in both languages', async ({
    page,
}) => {
    for (const path of ['/projects/bruno-pizza', '/en/projects/bruno-pizza']) {
        await page.goto(path)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await expect(page.locator('.page-hero__footer .case-study-hero__facts')).toContainText(
            'v1.2.0'
        )
        await expect(page.locator('.case-study__limits')).toContainText('Windows')
        await expect(page.locator('.production-story')).toContainText('20 photos')
    }
})

test('Bruno uses the locally shipped version 1.2 screenshot', async ({page}) => {
    await page.goto('/projects/bruno-pizza')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const image = page.locator('.bruno-gallery__screen img')
    await expect(image).toBeVisible()
    await expect
        .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
        .toBe(true)
    await image.scrollIntoViewIfNeeded()
    await page.screenshot({path: '/tmp/bruno-v12-preview.png'})
})

test('Bruno screenshots fit a compact frame without cropping on large and small screens', async ({
    page,
}) => {
    for (const size of [
        {width: 1920, height: 1080},
        {width: 1440, height: 900},
        {width: 390, height: 844},
    ]) {
        await page.setViewportSize(size)
        await page.goto('/projects/bruno-pizza')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const hero = await page.locator('.bruno-hero-visual').boundingBox()
        expect(hero.width).toBeLessThanOrEqual(521)
        const gallery = page.locator('.bruno-gallery')
        expect((await gallery.boundingBox()).width).toBeLessThanOrEqual(1101)
        const screen = page.locator('.bruno-gallery__screen')
        expect((await screen.boundingBox()).height).toBeLessThanOrEqual(size.height * 0.62 + 1)
        await expect(screen.locator('img')).toHaveCSS('object-fit', 'contain')
        await expect
            .poll(() => screen.locator('img').evaluate((e) => e.complete && e.naturalWidth > 0))
            .toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
    }
})
