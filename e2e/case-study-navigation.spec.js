import {test, expect} from '@playwright/test'
import axe from 'axe-core'

test('case studies have a visual hero and circular previous/next navigation in both languages', async ({
    page,
}) => {
    for (const prefix of ['', '/en']) {
        await page.goto(`${prefix}/projects/bruno-pizza`)
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await expect(page.locator('.bruno-hero-visual__sheet')).toBeVisible()
        await expect(page.locator('.bruno-hero-visual img')).toHaveCount(2)
        const pager = page.locator('.page-hero .case-study__pager')
        await expect(pager.locator('a[rel="next"]')).toHaveAttribute(
            'href',
            `${prefix}/projects/opendente`
        )
        await expect(pager.locator('a[rel="prev"]')).toHaveAttribute(
            'href',
            `${prefix}/projects/my-website`
        )
        await expect(pager.locator('a[rel="next"]')).toContainText('OpenDente')
        await expect(pager.locator('a[rel="prev"]')).toContainText('My-Website')
        await pager.locator('a[rel="next"]').click()
        await expect(page.getByRole('heading', {level: 1})).toContainText('OpenDente')
        await page.locator('.page-hero .case-study__pager a[rel="next"]').click()
        await expect(page).toHaveURL(new RegExp(`${prefix}/projects/my-website$`))
        await expect(page.locator('.website-delivery')).toContainText('Cloudflare R2')
        await expect(page.locator('.website-delivery')).toContainText('GitHub')
        await expect(page.locator('.page-hero__footer')).toContainText(
            prefix ? 'Responsibility' : 'Responsabilité'
        )
        await page.locator('.page-hero .case-study__pager a[rel="prev"]').click()
        await expect(page.getByRole('heading', {level: 1})).toContainText('OpenDente')
    }
})

test('new project heroes and navigation remain accessible across screen sizes', async ({page}) => {
    await page.addInitScript(axe.source)
    for (const width of [390, 768, 1440, 2560]) {
        await page.setViewportSize({width, height: 1000})
        for (const project of ['bruno-pizza', 'my-website', 'opendente']) {
            await page.goto(`/projects/${project}`)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            await expect(page.locator('.page-hero .case-study__pager')).toBeVisible()
            expect(
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
            ).toBe(true)
            expect(
                await page.evaluate(async () =>
                    (
                        await window.axe.run('.page-hero', {
                            runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']},
                        })
                    ).violations.map((v) => v.id)
                )
            ).toEqual([])
        }
    }
})
