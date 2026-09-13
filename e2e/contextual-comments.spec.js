import {test, expect} from '@playwright/test'

for (const {width, prefix, label} of [
    {width: 1440, prefix: '', label: 'Commenter ce passage'},
    {width: 390, prefix: '/en', label: 'Comment on this passage'},
]) {
    test(`passage action stays beside the selection at ${width}px`, async ({page}) => {
        await page.setViewportSize({width, height: 900})
        await page.route('**/api/comments?**', (route) =>
            route.fulfill({json: {comments: [], hasMore: false}})
        )
        await page.goto(`${prefix}/reflections/charte-de-pensee`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const paragraph = page.locator('.reflexion-article__content p').first()
        await paragraph.scrollIntoViewIfNeeded()
        await paragraph.evaluate((p) => {
            const r = document.createRange()
            r.selectNodeContents(p)
            const selection = getSelection()
            selection.removeAllRanges()
            selection.addRange(r)
        })
        const action = page.getByRole('button', {name: label, exact: true})
        await expect(action).toBeVisible()
        const box = await action.boundingBox()
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
        expect(box.y).toBeGreaterThan(0)
        expect(box.y + box.height).toBeLessThan(900)
        const scroll = await page.evaluate(() => scrollY)
        await page.screenshot({path: `/tmp/passage-selection-${width}.png`})
        await action.click()
        const dialog = page.getByRole('dialog')
        await expect(dialog).toBeVisible()
        await expect(dialog.locator('blockquote')).not.toBeEmpty()
        expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(2)
        await page.screenshot({path: `/tmp/passage-form-${width}.png`})
        await page.keyboard.press('Escape')
        await expect(dialog).not.toBeVisible()
    })
}
