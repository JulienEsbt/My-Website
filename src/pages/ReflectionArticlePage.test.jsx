import {render, screen, waitFor} from '@testing-library/react'
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

        expect(
            screen.getByText('Cette réflexion n’existe pas ou n’est plus disponible.')
        ).toBeInTheDocument()
        expect(screen.getByRole('link', {name: 'Voir les réflexions'})).toHaveAttribute(
            'href',
            '/reflections'
        )
    })

    it('renders the English MDX article without the French fallback notice', async () => {
        await i18n.changeLanguage('en')

        render(
            <MemoryRouter initialEntries={['/reflections/verite-liberte-construction-de-soi']}>
                <Routes>
                    <Route path="/reflections/:slug" element={<ReflectionArticlePage />} />
                </Routes>
            </MemoryRouter>
        )

        expect(
            await screen.findByRole('heading', {
                level: 1,
                name: 'Truth, freedom and self-construction',
            })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: 'The more I learn, the more wary I become of certainty.',
            })
        ).toBeVisible()
        await waitFor(() => {
            expect(
                screen.queryByText('This article is currently available in French only.')
            ).not.toBeInTheDocument()
        })
    })
})
