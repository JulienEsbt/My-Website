import {test, expect} from '@playwright/test'

test('resource cards expose destinations and can collapse', async ({page}) => {
    await page.goto('/web3')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const card = page.locator('.tools-v2__card').first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('opacity', '1')
    await expect(card.locator('.tools-v2__list')).toBeVisible()
    await expect(card.locator('.tools-v2__label small').first()).not.toBeEmpty()
    await page.locator('.tools-v2').screenshot({path: '/tmp/resources-refreshed.png'})
    await card.locator('.tools-v2__head').click()
    await expect(card.locator('.tools-v2__list')).not.toBeVisible()
})
