import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {MemoryRouter, useLocation} from 'react-router-dom'
import i18n from 'i18next'
import Router from './router.jsx'

vi.mock('../pages/HomePage', () => ({default: () => <p>Home</p>}))
vi.mock('../pages/Web3Page', () => ({default: () => <p>Web3</p>}))
vi.mock('../pages/TravelPage', () => ({default: () => <p>Travel</p>}))
vi.mock('../pages/ReflectionsPage', () => ({default: () => <p>Reflections</p>}))
vi.mock('../pages/ReflectionArticlePage', () => ({default: () => <p>Article</p>}))
vi.mock('../components/common/navigation/pageNav/PageNav.jsx', () => ({default: () => null}))
vi.mock('../components/common/layout/footerSection/Footer.jsx', () => ({default: () => null}))

const LocationProbe = () => {
    const location = useLocation()
    return <output data-testid="location">{location.pathname}</output>
}

describe('Router', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('keeps an unknown URL and displays a real not-found page', () => {
        render(
            <MemoryRouter initialEntries={['/page-inconnue']}>
                <Router />
                <LocationProbe />
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', {name: 'Cette page n’existe pas ou plus.'})).toBeVisible()
        expect(screen.getByTestId('location')).toHaveTextContent('/page-inconnue')
        expect(screen.getByRole('link', {name: 'Retour au portfolio'})).toHaveAttribute('href', '/')
    })
})
