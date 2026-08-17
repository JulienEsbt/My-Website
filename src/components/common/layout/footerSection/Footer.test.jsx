import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import Footer from './Footer.jsx'

vi.mock('gsap', () => ({
    gsap: {
        context: (callback) => {
            callback()
            return {revert: vi.fn()}
        },
        from: vi.fn(),
        registerPlugin: vi.fn(),
    },
}))

vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {}}))

describe('Footer', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('annonce la page actuellement consultée', () => {
        render(
            <MemoryRouter initialEntries={['/travel']}>
                <Footer />
            </MemoryRouter>
        )

        expect(screen.getByRole('link', {name: 'Voyages'})).toHaveAttribute('aria-current', 'page')
        expect(screen.getByRole('link', {name: 'Portfolio'})).not.toHaveAttribute('aria-current')
        expect(screen.getByRole('link', {name: 'Confidentialité'})).toHaveAttribute(
            'href',
            '/privacy'
        )
    })
})
