import {test, expect} from '@playwright/test'

test('chapter handoff stays centered, reverses and restores full readability', async ({page}) => {
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
    const incoming = page.locator('#services .professional-chapter__heading')
    await page.evaluate((y) => scrollTo(0, y), bounds.end + 10)
    await expect(incoming).toHaveCSS('opacity', '1')
    await page.evaluate((y) => scrollTo(0, y), bounds.start + (bounds.end - bounds.start) * 0.5)
    await expect(incoming).toHaveCSS('opacity', '1')
    await expect(outgoing).toHaveCSS('opacity', '1')
    await expect(incoming).toHaveCSS('clip-path', 'none')
    await expect(outgoing).toHaveCSS('clip-path', 'none')
    await page.evaluate((y) => scrollTo(0, y), bounds.start - 10)
    await expect(outgoing).toHaveCSS('opacity', '1')
    await expect(incoming).toHaveCSS('visibility', 'hidden')
    await page.emulateMedia({reducedMotion: 'reduce'})
    await expect(incoming).toHaveCSS('opacity', '1')
})
