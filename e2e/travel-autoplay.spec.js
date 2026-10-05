import {test, expect} from '@playwright/test'

for (const width of [393, 1440]) {
    test(`travel dream cards and gallery start automatically at ${width}px`, async ({page}) => {
        test.setTimeout(60000)
        await page.setViewportSize({width, height: 900})
        await page.emulateMedia({reducedMotion: 'no-preference'})
        await page.goto('/travel')
        await page
            .locator('#dreams')
            .evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}))
        const counter = page.locator('.dream-showcase__counter')
        await expect(counter).toContainText('1 /')
        await expect(counter).toContainText('2 /', {timeout: 12000})
        await page
            .locator('#dreams')
            .getByRole('button', {name: 'Mettre le défilement en pause'})
            .click()
        await expect(
            page.locator('#dreams').getByRole('button', {name: 'Reprendre le défilement'})
        ).toHaveAttribute('aria-pressed', 'true')
        await page.goto('/travel/portugal-2025')
        await page.locator('.travel-timeline__photo-hero').click()
        const photo = page.locator('.travel-timeline__lightbox-counter')
        await expect(photo).toContainText('1 /')
        await expect(photo).toContainText('2 /', {timeout: 12000})
        await page.locator('.gallery-playback').click()
        await expect(page.locator('.gallery-playback')).toHaveAttribute('aria-pressed', 'true')
        await page.emulateMedia({reducedMotion: 'reduce'})
        await expect(page.locator('.gallery-playback')).toBeDisabled()
    })
}
