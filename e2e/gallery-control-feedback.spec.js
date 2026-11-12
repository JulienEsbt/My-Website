import {test, expect, chromium, webkit} from '@playwright/test'

const galleries = [
    {
        name: 'travel',
        path: '/travel/portugal-2025',
        open: '.travel-timeline__photo-hero',
        next: '.travel-timeline__lightbox-nav.next',
        counter: '.travel-timeline__lightbox-counter',
    },
    {
        name: 'Bruno Pizza',
        path: '/projects/bruno-pizza',
        next: '.bruno-gallery__controls button[aria-label="Capture suivante"]',
        counter: '.bruno-gallery__caption span',
    },
    {
        name: 'OpenDente',
        path: '/projects/opendente',
        next: '.opendente-gallery__toolbar button:last-of-type',
        counter: '.opendente-gallery__toolbar > span',
    },
]

const appearance = (button) =>
    button.evaluate((element) => {
        const style = getComputedStyle(element)
        return {background: style.backgroundColor, color: style.color, transform: style.transform}
    })

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const touch of [true, false]) {
        for (const gallery of galleries) {
            test(`${gallery.name} arrows: ${touch ? 'tap resets' : 'desktop hover stays'} in ${engine}`, async () => {
                const browser = await browserType.launch()
                const page = await browser.newPage({
                    viewport: {width: touch ? 393 : 1440, height: 900},
                    hasTouch: touch,
                    isMobile: touch,
                    reducedMotion: 'no-preference',
                    locale: 'fr-FR',
                })
                try {
                    await page.goto(`http://localhost:3101${gallery.path}`)
                    if (gallery.open) await page.locator(gallery.open).click()
                    const next = page.locator(gallery.next)
                    await next.scrollIntoViewIfNeeded()
                    const normal = await appearance(next)
                    const before = await page.locator(gallery.counter).textContent()
                    if (touch) {
                        await next.tap()
                        await expect(page.locator(gallery.counter)).not.toHaveText(before)
                        await expect.poll(() => appearance(next)).toEqual(normal)
                        await next.tap()
                        await expect.poll(() => appearance(next)).toEqual(normal)
                        if (gallery.name === 'travel') {
                            await expect(page.locator('.gallery-playback')).toHaveAttribute(
                                'aria-pressed',
                                'false'
                            )
                            await expect
                                .poll(() =>
                                    page
                                        .locator('.travel-timeline__lightbox-image-frame img')
                                        .evaluate(
                                            (image) => image.complete && image.naturalWidth > 0
                                        )
                                )
                                .toBe(true)
                            await page.screenshot({
                                path: test.info().outputPath('mobile-after-tap.png'),
                            })
                        }
                    } else {
                        await next.hover()
                        await expect.poll(() => appearance(next)).not.toEqual(normal)
                        await next.click()
                        await expect(page.locator(gallery.counter)).not.toHaveText(before)
                        await expect.poll(() => appearance(next)).not.toEqual(normal)
                        await page.mouse.move(0, 0)
                        await expect.poll(() => appearance(next)).toEqual(normal)
                        await next.press('Shift+Tab')
                        await page.keyboard.press('Tab')
                        await expect(next).toBeFocused()
                        await expect(next).toHaveCSS('outline-style', 'solid')
                    }
                } finally {
                    await browser.close()
                }
            })
        }
    }
}
