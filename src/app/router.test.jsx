import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Link, MemoryRouter, useLocation} from 'react-router-dom'
import i18n from 'i18next'
import Router from './router.jsx'

vi.mock('../pages/HomePage.jsx', () => ({
    default: () => (
        <main id="main" tabIndex={-1}>
            <h1>Home</h1>
        </main>
    ),
}))
vi.mock('../pages/BrunoPizzaCaseStudyPage.jsx', () => ({default: () => <p>Bruno Pizza</p>}))
vi.mock('../pages/MyWebsiteCaseStudyPage.jsx', () => ({default: () => <p>My-Website</p>}))
vi.mock('../pages/ResumePage.jsx', () => ({default: () => <p>Resume</p>}))
vi.mock('../pages/PrivacyPage.jsx', () => ({default: () => <p>Privacy</p>}))
vi.mock('../pages/Web3Page.jsx', () => ({default: () => <p>Web3</p>}))
vi.mock('../pages/TravelPage.jsx', () => ({default: () => <p>Travel</p>}))
vi.mock('../pages/ReflectionsPage.jsx', () => ({
    default: () => <Link to="/">Portfolio</Link>,
}))
vi.mock('../pages/ReflectionArticlePage.jsx', () => ({default: () => <p>Article</p>}))
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

    it('loads a page route asynchronously', async () => {
        render(
            <MemoryRouter initialEntries={['/travel']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('Travel')).toBeVisible()
    })

    it('focuses the main content after a keyboard link leaves the page', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/reflections']}>
                <Router />
            </MemoryRouter>
        )

        const link = await screen.findByRole('link', {name: 'Portfolio'})
        await user.tab()
        expect(link).toHaveFocus()
        await user.keyboard('{Enter}')

        expect(await screen.findByRole('main')).toHaveFocus()
    })

    it('loads a travel story through its clean localized route', async () => {
        render(
            <MemoryRouter initialEntries={['/en/travel/croatia-2026']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('Travel')).toBeVisible()
    })

    it('loads the Bruno Pizza case study route asynchronously', async () => {
        render(
            <MemoryRouter initialEntries={['/projects/bruno-pizza']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('Bruno Pizza')).toBeVisible()
    })

    it('loads the My-Website case study route asynchronously', async () => {
        render(
            <MemoryRouter initialEntries={['/projects/my-website']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('My-Website')).toBeVisible()
    })

    it('loads the accessible resume route asynchronously', async () => {
        render(
            <MemoryRouter initialEntries={['/resume']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('Resume')).toBeVisible()
    })

    it('loads the privacy information route asynchronously', async () => {
        render(
            <MemoryRouter initialEntries={['/privacy']}>
                <Router />
            </MemoryRouter>
        )

        expect(await screen.findByText('Privacy')).toBeVisible()
    })

    it('keeps an unknown URL and displays a real not-found page', async () => {
        render(
            <MemoryRouter initialEntries={['/page-inconnue']}>
                <Router />
                <LocationProbe />
            </MemoryRouter>
        )

        expect(
            await screen.findByRole('heading', {name: 'Cette page n’existe pas ou plus.'})
        ).toBeVisible()
        expect(screen.getByTestId('location')).toHaveTextContent('/page-inconnue')
        expect(screen.getByRole('link', {name: 'Retour au portfolio'})).toHaveAttribute('href', '/')
    })
})
