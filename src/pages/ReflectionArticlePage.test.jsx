import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {MemoryRouter, Route, Routes} from 'react-router-dom'
import i18n from 'i18next'
import ReflectionArticlePage from './ReflectionArticlePage.jsx'

vi.mock('../components/common/navigation/pageNav/PageNav.jsx', () => ({default: () => null}))
vi.mock('../components/common/layout/footerSection/Footer.jsx', () => ({default: () => null}))

describe('ReflectionArticlePage', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('shows the not-found state for an unknown article without redirecting', () => {
        render(
            <MemoryRouter initialEntries={['/reflections/article-inconnu']}>
                <Routes>
                    <Route path="/reflections/:slug" element={<ReflectionArticlePage />} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Cette réflexion n’existe pas ou n’est plus disponible.')).toBeVisible()
        expect(screen.getByRole('link', {name: 'Voir les réflexions'})).toHaveAttribute(
            'href',
            '/reflections'
        )
    })
})
