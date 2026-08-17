import {render, screen, within} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import Portfolio from './Portfolio.jsx'

vi.mock('gsap', () => ({
    default: {
        context: () => ({revert: vi.fn()}),
        from: vi.fn(),
        registerPlugin: vi.fn(),
    },
}))
vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {}}))
vi.mock('../../../components/common/accessibility/useReducedMotion.js', () => ({
    default: () => true,
}))
vi.mock('../../../components/common/media/ResponsiveImage.jsx', () => ({
    default: ({alt}) => <img alt={alt} />,
}))

describe('Portfolio', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('links the selected project to its case study and public repository', () => {
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )

        const project = screen
            .getByRole('heading', {name: 'Bruno Pizza — Production'})
            .closest('article')

        expect(project).not.toBeNull()
        expect(within(project).getByRole('link', {name: 'Voir l’étude de cas'})).toHaveAttribute(
            'href',
            '/projects/bruno-pizza'
        )
        expect(within(project).getByRole('link', {name: 'Voir le code'})).toHaveAttribute(
            'href',
            'https://github.com/JulienEsbt/bruno-pizza-production'
        )
    })

    it('uses the repository for the My-Website project image', () => {
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )

        expect(screen.getByRole('link', {name: 'Voir le code · My-Website'})).toHaveAttribute(
            'href',
            'https://github.com/JulienEsbt/My-Website'
        )
    })
})
