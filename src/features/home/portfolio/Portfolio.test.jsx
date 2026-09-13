import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

    it('opens the case study from project images and keeps code links explicit', () => {
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('link', {name: 'Voir l’étude de cas · My-Website'})
        ).toHaveAttribute('href', '/projects/my-website')
    })

    it('presents Agora as a private project intent without a public link', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )

        const project = screen
            .getByRole('heading', {name: 'Agora — Graphe des débats'})
            .closest('article')
        const details = project.querySelector('details')

        expect(within(project).queryByRole('link')).not.toBeInTheDocument()
        expect(details).not.toHaveAttribute('open')

        await user.click(within(project).getByText('Découvrir l’intention du projet'))

        expect(details).toHaveAttribute('open')
        expect(within(project).getByText(/Un prototype local non publié/)).toBeVisible()
        expect(within(project).getByText(/ni comptes, ni collaboration distante/)).toBeVisible()
    })

    it('provides the approved English Agora copy', async () => {
        await i18n.changeLanguage('en')
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', {name: 'Agora — Debate graph'})).toBeVisible()
        expect(screen.getByText('New project · In development')).toBeVisible()
        expect(screen.getByText('Explore the project’s intent')).toBeVisible()
    })
})
