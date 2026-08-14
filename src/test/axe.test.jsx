import {render} from '@testing-library/react'
import axe from 'axe-core'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'

describe('automated accessibility baseline', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('finds no axe violation in the shared page structure', async () => {
        const {container} = render(
            <MemoryRouter>
                <PageFrame>
                    <h1>Page de contrôle</h1>
                    <section aria-labelledby="test-section-title">
                        <h2 id="test-section-title">Contenu accessible</h2>
                        <label htmlFor="test-input">Recherche</label>
                        <input id="test-input" type="search" />
                        <button type="button">Valider</button>
                    </section>
                </PageFrame>
            </MemoryRouter>
        )

        const results = await axe.run(container, {
            rules: {
                'color-contrast': {enabled: false},
                region: {enabled: false},
            },
        })

        expect(results.violations).toEqual([])
    })
})
