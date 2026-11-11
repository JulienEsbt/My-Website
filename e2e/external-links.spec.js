import {test, expect} from '@playwright/test'

test('external destinations keep the portfolio open in both languages', async ({page}) => {
    for (const path of ['/resources', '/en/resources', '/privacy', '/en/privacy']) {
        await page.goto(path)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const links = page.locator('a[href^="https://"]')
        expect(await links.count()).toBeGreaterThan(0)
        for (const link of await links.all()) {
            await expect(link).toHaveAttribute('target', '_blank')
            await expect(link).toHaveAttribute('rel', /noreferrer/)
        }
    }
})
