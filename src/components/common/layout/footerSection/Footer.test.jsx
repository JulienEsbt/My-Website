import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
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
    it('annonce la page actuellement consultée', () => {
        render(
            <MemoryRouter initialEntries={['/travel']}>
                <Footer />
            </MemoryRouter>
        )

        expect(screen.getByRole('link', {name: 'Voyages'})).toHaveAttribute(
            'aria-current',
            'page'
        )
        expect(screen.getByRole('link', {name: 'Portfolio'})).not.toHaveAttribute('aria-current')
    })
})
