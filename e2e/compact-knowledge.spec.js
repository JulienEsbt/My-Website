import {test, expect} from '@playwright/test'

test('knowledge follows its content and explorer fades transparently', async ({page}) => {
    await page.setViewportSize({width: 1920, height: 1080})
    await page.goto('/web3')
    const menu = page.locator('.knowledge-v3__tab')
    await expect(menu).toHaveCount(6)
    for (let i = 0; i < 6; i++) {
        await menu.nth(i).click()
        const panel = page.locator('.knowledge-v3__panel')
        const gap = await panel.evaluate(
            (el) =>
                el.getBoundingClientRect().bottom -
                el.lastElementChild.getBoundingClientRect().bottom
        )
        expect(gap).toBeLessThan(35)
    }
    await menu.filter({hasText: 'DeFi'}).click()
    await expect(menu.last()).toHaveCSS('opacity', '1')
    await page.waitForTimeout(450)
    await page.screenshot({path: '/tmp/knowledge-compact-final.png'})
    const viewport = page.locator('.blockchain-embla__viewport')
    await expect(viewport).not.toHaveCSS('mask-image', 'none')
    await expect(page.locator('.blockchain-embla')).toHaveCSS('position', 'relative')
    await page.setViewportSize({width: 390, height: 844})
    await expect(page.locator('.knowledge-v3__panel')).not.toBeVisible()
    await menu.filter({hasText: 'DeFi'}).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
    await page.screenshot({path: '/tmp/knowledge-mobile-final.png'})
    await page.locator('.knowledge-v3__back').click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
})
