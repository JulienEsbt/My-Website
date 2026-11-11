import {test, expect, chromium, webkit} from '@playwright/test'

for (const [engine, browserType] of Object.entries({chromium, webkit})) {
    for (const width of [393, 1440]) {
        test(`carousel controls keep autoplay unless explicitly paused: ${engine}, ${width}px`, async () => {
            test.setTimeout(90000)
            const browser = await browserType.launch()
            const page = await browser.newPage({
                viewport: {width, height: 900},
                reducedMotion: 'no-preference',
                locale: 'fr-FR',
            })
            try {
                await page.goto('http://localhost:4173/')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const goals = page.locator('#goals')
                const swiper = goals.locator('.swiper')
                await swiper.scrollIntoViewIfNeeded()
                await swiper.locator('.swiper-pagination-bullet').nth(2).click()
                await expect
                    .poll(() =>
                        swiper.evaluate(
                            (el) => el.swiper.autoplay.running && !el.swiper.autoplay.paused
                        )
                    )
                    .toBe(true)
                const selected = await swiper.evaluate((el) => el.swiper.realIndex)
                await expect
                    .poll(() => swiper.evaluate((el) => el.swiper.realIndex), {timeout: 10000})
                    .not.toBe(selected)
                await goals.getByRole('button', {name: 'Mettre le défilement en pause'}).click()
                await swiper.locator('.swiper-pagination-bullet').nth(0).click()
                await expect
                    .poll(() => swiper.evaluate((el) => el.swiper.autoplay.running))
                    .toBe(false)

                await page.goto('http://localhost:4173/web3')
                await page.locator('#prerendered-content').waitFor({state: 'detached'})
                const explorer = page.locator('#blockchain-explorer')
                const controls = explorer.locator('.blockchain-embla__controls button')
                const track = explorer.locator('.blockchain-embla__container')
                const position = () =>
                    track.evaluate(
                        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41
                    )
                const drag = async () => {
                    const box = await explorer.locator('.blockchain-embla__viewport').boundingBox()
                    await page.mouse.move(box.x + box.width * 0.7, box.y + 80)
                    await page.mouse.down()
                    await page.mouse.move(box.x + box.width * 0.3, box.y + 80, {steps: 8})
                    await page.mouse.up()
                }
                await explorer.scrollIntoViewIfNeeded()
                await controls.nth(1).click()
                const afterNext = await position()
                await expect
                    .poll(async () => Math.abs((await position()) - afterNext), {timeout: 6000})
                    .toBeGreaterThan(3)
                await drag()
                await page.waitForTimeout(1500)
                const afterDrag = await position()
                await expect
                    .poll(async () => Math.abs((await position()) - afterDrag), {timeout: 6000})
                    .toBeGreaterThan(3)
                await controls.nth(2).click()
                await controls.nth(1).click()
                await drag()
                // Drag-free momentum is manual movement; wait until it settles before
                // checking that autoplay cannot restart after an explicit pause.
                await expect
                    .poll(
                        async () => {
                            const before = await position()
                            await page.waitForTimeout(250)
                            return Math.abs((await position()) - before)
                        },
                        {timeout: 15000}
                    )
                    .toBeLessThan(0.5)
                const paused = await position()
                await page.waitForTimeout(1500)
                // Embla finishes fractional-pixel settling even while autoplay is stopped.
                expect(Math.abs((await position()) - paused)).toBeLessThan(0.5)
                await controls.nth(2).click()
                await expect
                    .poll(async () => Math.abs((await position()) - paused), {timeout: 6000})
                    .toBeGreaterThan(3)
            } finally {
                await browser.close()
            }
        })
    }
}
