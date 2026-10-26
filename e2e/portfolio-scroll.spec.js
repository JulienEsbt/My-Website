import {test, expect} from '@playwright/test'

test('native page scrolling reveals each project and works in reverse', async ({page}) => {
    await page.setViewportSize({width: 1600, height: 1000})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const journey = page.locator('.portfolio__journey[data-scroll-enabled="true"]')
    await expect(journey).toBeVisible()
    await expect
        .poll(() => page.locator('#portfolio').evaluate((el) => getComputedStyle(el).opacity))
        .toBe('1')
    const metrics = await journey.evaluate((el) => ({
        start:
            scrollY +
            el.getBoundingClientRect().top -
            parseFloat(getComputedStyle(el).getPropertyValue('--project-top')),
        distance: parseFloat(getComputedStyle(el).getPropertyValue('--project-step-distance')),
    }))
    await page.evaluate((top) => scrollTo({top, behavior: 'instant'}), metrics.start)
    const names = [/Bruno Pizza/, /OpenDente/, /My-Website/, /Archivage/, /Agora/]
    for (let index = 0; index < names.length; index++) {
        if (index) await page.mouse.wheel(0, metrics.distance)
        await expect(page.getByRole('tab', {name: names[index]})).toHaveAttribute(
            'aria-selected',
            'true'
        )
        await expect(page.getByRole('tabpanel').getByRole('heading', {level: 3})).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
    }
    await page.mouse.wheel(0, -metrics.distance)
    await expect(page.getByRole('tab', {name: /Archivage/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
    await page.evaluate(
        (top) => scrollTo({top, behavior: 'instant'}),
        metrics.start + metrics.distance * 5 + 1000
    )
    await expect
        .poll(() => journey.boundingBox().then((box) => box.y + box.height))
        .toBeLessThan(200)
})

test('manual choice synchronizes the scroll position and Agora reading preserves it', async ({
    page,
}) => {
    await page.setViewportSize({width: 1600, height: 1000})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('.portfolio__journey')).toHaveAttribute('data-scroll-enabled', 'true')
    await expect
        .poll(() => page.locator('#portfolio').evaluate((el) => getComputedStyle(el).opacity))
        .toBe('1')
    await page.getByRole('tab', {name: /Agora/}).click()
    await expect
        .poll(() =>
            page
                .locator('.portfolio__journey')
                .evaluate((el) =>
                    Math.abs(
                        (parseFloat(getComputedStyle(el).getPropertyValue('--project-top')) -
                            el.getBoundingClientRect().top) /
                            parseFloat(
                                getComputedStyle(el).getPropertyValue('--project-step-distance')
                            ) -
                            4
                    )
                )
        )
        .toBeLessThan(0.02)
    await expect(
        page.getByRole('tabpanel').getByRole('heading', {name: 'Agora — Graphe des débats'})
    ).toBeVisible()
    await expect
        .poll(() =>
            page
                .locator('.portfolio__stage')
                .evaluate((el) =>
                    Math.abs(
                        el.getBoundingClientRect().top -
                            parseFloat(
                                getComputedStyle(el.parentElement).getPropertyValue('--project-top')
                            )
                    )
                )
        )
        .toBeLessThan(3)
    const trigger = page.getByRole('button', {name: 'Découvrir l’intention du projet'})
    const readingTop = await page.evaluate(() => scrollY)
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').getByRole('button', {name: 'Fermer'}).click()
    await expect(page.locator('.portfolio__journey')).toHaveAttribute('data-scroll-enabled', 'true')
    await expect(page.locator('body')).not.toHaveCSS('position', 'fixed')
    await expect.poll(() => page.evaluate((y) => Math.abs(scrollY - y), readingTop)).toBeLessThan(3)
    await expect(trigger).toBeFocused()
    await expect(page.getByRole('tab', {name: /Agora/})).toBeInViewport()
    await expect(page.getByRole('tabpanel').getByRole('link')).toHaveCount(0)
})

test('reduced motion and short screens keep manual project navigation', async ({page}) => {
    await page.setViewportSize({width: 1600, height: 1000})
    await page.emulateMedia({reducedMotion: 'reduce'})
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('.portfolio__journey')).toHaveAttribute(
        'data-scroll-enabled',
        'false'
    )
    await page.getByRole('tab', {name: /OpenDente/}).click()
    await expect(page.getByRole('tabpanel')).toContainText('OpenDente — Personal Edition')
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.setViewportSize({width: 1280, height: 650})
    await expect(page.locator('.portfolio__journey')).toHaveAttribute(
        'data-scroll-enabled',
        'false'
    )
})

test('all case studies share the same back and GitHub actions in both languages', async ({
    page,
}) => {
    for (const prefix of ['', '/en']) {
        for (const project of ['bruno-pizza', 'my-website', 'opendente']) {
            await page.goto(`${prefix}/projects/${project}`)
            await page.locator('#prerendered-content').waitFor({state: 'detached'})
            const actions = page.locator('.case-study__actions')
            const links = actions.getByRole('link')
            await expect(links.first()).toHaveText(
                prefix ? 'Back to projects' : 'Retour aux projets'
            )
            await expect(links.first()).toHaveAttribute(
                'href',
                `${prefix || '/'}${prefix ? '#' : '#'}portfolio`
            )
            await expect(links.first()).toHaveClass(/btn/)
            await expect(links.last()).toHaveText(
                prefix ? 'View GitHub repository' : 'Voir le dépôt GitHub'
            )
            await expect(links.last()).toHaveClass(/btn-primary/)
            await expect(links.last()).toHaveAttribute('href', /github.com\/JulienEsbt\//)
        }
    }
})

test('returning from a case study resumes the selected scroll step after layout settles', async ({
    page,
}) => {
    await page.setViewportSize({width: 1600, height: 1000})
    await page.emulateMedia({reducedMotion: 'no-preference'})
    await page.goto('/#portfolio')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    await expect(page.locator('.portfolio__journey')).toHaveAttribute('data-scroll-enabled', 'true')
    await page.getByRole('tab', {name: /OpenDente/}).click()
    await page
        .getByRole('tabpanel')
        .getByRole('link', {name: 'Voir l’étude de cas', exact: true})
        .click()
    await expect(page).toHaveURL(/\/projects\/opendente$/)
    await page.getByRole('link', {name: 'Retour aux projets', exact: true}).click()
    await expect(page.locator('.portfolio__journey')).toHaveAttribute('data-scroll-enabled', 'true')
    await expect(page.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
    // The shared anchor restoration watches late layout changes for two seconds.
    await page.waitForTimeout(2200)
    await expect(page.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
    const distance = await page
        .locator('.portfolio__journey')
        .evaluate((el) =>
            parseFloat(getComputedStyle(el).getPropertyValue('--project-step-distance'))
        )
    await page.mouse.wheel(0, distance)
    await expect(page.getByRole('tab', {name: /My-Website/})).toHaveAttribute(
        'aria-selected',
        'true'
    )
})
