import {test, expect} from '@playwright/test'

for (const width of [1600, 390]) {
    test(`passage threads live beside the text and general comments stay below at ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({width, height: 900})
        let comments = [
            {
                id: 'general',
                pseudonym: 'Lecture globale',
                body: 'Une réaction générale.',
                quote: '',
                prefix: '',
                suffix: '',
                createdAt: new Date().toISOString(),
            },
        ]
        await page.route('**/api/comments?**', async (route) => {
            if (route.request().method() === 'POST') {
                const comment = {
                    ...route.request().postDataJSON(),
                    id: String(comments.length),
                    createdAt: new Date().toISOString(),
                }
                comments = [comment, ...comments]
                return route.fulfill({json: {comment, deleteToken: 'test-key'}})
            }
            if (route.request().method() === 'DELETE') {
                comments = comments.filter((c) => c.id !== route.request().postDataJSON().id)
                return route.fulfill({json: {ok: true}})
            }
            return route.fulfill({json: {comments, hasMore: false}})
        })
        await page.goto('/reflections/charte-de-pensee')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        const paragraph = page.locator('.reflexion-article__content p').first()
        await paragraph.scrollIntoViewIfNeeded()
        await paragraph.evaluate((p) => {
            const r = document.createRange()
            r.selectNodeContents(p)
            const s = getSelection()
            s.removeAllRanges()
            s.addRange(r)
        })
        await page.getByRole('button', {name: 'Commenter ce passage', exact: true}).click()
        const composer = page.getByRole('dialog')
        await expect(composer).toBeVisible()
        expect(await composer.evaluate((el) => el.matches(':modal'))).toBe(false)
        await expect(page.locator('.passage-highlights .is-active').first()).toBeVisible()
        if (width >= 1280) {
            const text = await page.locator('.reflexion-article__content').boundingBox()
            const pane = await composer.boundingBox()
            expect(pane.x).toBeGreaterThanOrEqual(text.x + text.width)
        }
        await composer.getByLabel('Pseudonyme').fill('Camille')
        await composer.getByLabel('Ton commentaire').fill('Une précision sur ce passage.')
        await composer.getByRole('button', {name: 'Publier', exact: true}).click()
        const thread = page.locator('.passage-thread')
        await expect(thread).toContainText('Une précision sur ce passage.')
        await expect(page.locator('.reader-comments > .reader-comments__item')).toHaveCount(1)
        await expect(page.locator('.passage-marker')).toHaveCount(1)
        await thread.getByRole('button', {name: 'Ajouter un commentaire', exact: true}).click()
        await composer.getByLabel('Pseudonyme').fill('Alex')
        await composer
            .getByLabel('Ton commentaire')
            .fill('Un autre point de vue sur le même passage.')
        await composer.getByRole('button', {name: 'Publier', exact: true}).click()
        await expect(thread.locator('.reader-comments__item')).toHaveCount(2)
        await expect(page.locator('.passage-marker')).toContainText('2')
        await page.screenshot({path: `/tmp/margin-thread-${width}.png`})
        await thread.getByRole('button', {name: 'Fermer les commentaires'}).click()
        await expect(thread).not.toBeVisible()
        await page.locator('.passage-marker').click()
        await expect(thread).toBeVisible()
        await thread
            .getByRole('button', {name: 'Retirer ce commentaire', exact: true})
            .first()
            .click()
        await expect(thread.locator('.reader-comments__item')).toHaveCount(1)
        await page.reload()
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await page.locator('.passage-marker').click()
        await expect(thread).toContainText('Camille')
        await expect
            .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
            .toBe(true)
    })
}

test('changed passages remain accessible without being attached to unrelated text', async ({
    page,
}) => {
    await page.route('**/api/comments?**', (route) =>
        route.fulfill({
            json: {
                comments: [
                    {
                        id: 'old',
                        pseudonym: 'Camille',
                        body: 'Un commentaire historique.',
                        quote: 'Cette phrase ne figure plus dans la réflexion.',
                        prefix: '',
                        suffix: '',
                        createdAt: new Date().toISOString(),
                    },
                ],
                hasMore: false,
            },
        })
    )
    await page.goto('/reflections/charte-de-pensee')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await page.locator('.passage-orphans summary').click()
    await page.locator('.passage-orphans .reader-comments__quote').click()
    await expect(page.locator('.passage-thread')).toContainText('Ce passage a changé')
    await expect(page.locator('.passage-thread')).toContainText('Un commentaire historique.')
    await expect(page.locator('.passage-marker')).toHaveCount(0)
})
