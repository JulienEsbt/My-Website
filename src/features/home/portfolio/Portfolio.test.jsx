import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import Portfolio from './Portfolio.jsx'
import AgoraProjectCard from './AgoraProjectCard.jsx'

vi.mock('gsap', () => ({
    default: {context: () => ({revert: vi.fn()}), from: vi.fn(), registerPlugin: vi.fn()},
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
        sessionStorage.clear()
        await i18n.changeLanguage('fr')
    })

    it('shows one project with its study and repository while keeping all five in the index', () => {
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        expect(screen.getAllByRole('tab')).toHaveLength(5)
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
        const project = screen.getByRole('tabpanel')
        expect(
            within(project).getByRole('heading', {name: 'Bruno Pizza — Production'})
        ).toBeVisible()
        expect(
            within(project).getByRole('link', {name: 'Voir l’étude de cas', exact: true})
        ).toHaveAttribute('href', '/projects/bruno-pizza')
        expect(within(project).getByRole('link', {name: 'Voir le code'})).toHaveAttribute(
            'href',
            'https://github.com/JulienEsbt/bruno-pizza-production'
        )
    })

    it('switches projects with arrow keys, End and Home, and remembers the selection', async () => {
        const user = userEvent.setup()
        const view = render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        screen.getByRole('tab', {name: /Bruno Pizza/}).focus()
        await user.keyboard('{ArrowDown}')
        expect(screen.getByRole('tab', {name: /OpenDente/})).toHaveFocus()
        expect(screen.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
            'aria-selected',
            'true'
        )
        expect(
            within(screen.getByRole('tabpanel')).getByRole('link', {
                name: 'Voir l’étude de cas',
                exact: true,
            })
        ).toHaveAttribute('href', '/projects/opendente')
        view.unmount()
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        expect(screen.getByRole('tab', {name: /OpenDente/})).toHaveAttribute(
            'aria-selected',
            'true'
        )
        screen.getByRole('tab', {name: /OpenDente/}).focus()
        await user.keyboard('{End}')
        expect(screen.getByRole('tab', {name: /Agora/})).toHaveAttribute('aria-selected', 'true')
        await user.keyboard('{Home}')
        expect(screen.getByRole('tab', {name: /Bruno Pizza/})).toHaveAttribute(
            'aria-selected',
            'true'
        )
    })

    it('opens the case study from the selected project image', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        await user.click(screen.getByRole('tab', {name: /My-Website/}))
        expect(
            screen.getByRole('link', {name: 'Voir l’étude de cas · My-Website'})
        ).toHaveAttribute('href', '/projects/my-website')
    })

    it('presents Agora in the same selector as a private intent without a public link', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        await user.click(screen.getByRole('tab', {name: /Agora/}))
        const project = screen.getByRole('tabpanel')
        expect(within(project).queryByRole('link')).not.toBeInTheDocument()
        expect(
            within(project).getByRole('button', {name: 'Découvrir l’intention du projet'})
        ).toHaveAttribute('aria-haspopup', 'dialog')
    })

    it('keeps the complete intent readable without JavaScript enhancement', async () => {
        const user = userEvent.setup()
        const {container} = render(<AgoraProjectCard />)
        const details = container.querySelector('details')
        expect(details).not.toHaveAttribute('open')
        await user.click(screen.getByText('Découvrir l’intention du projet'))
        expect(details).toHaveAttribute('open')
        expect(screen.getByText(/Un prototype local non publié/)).toBeVisible()
    })

    it('honors the existing direct Agora anchor before any saved selection', async () => {
        sessionStorage.setItem('portfolio.selectedProject', '4')
        render(
            <MemoryRouter initialEntries={['/#agora-project-title']}>
                <Portfolio />
            </MemoryRouter>
        )
        expect(screen.getByRole('heading', {name: 'Agora — Graphe des débats'})).toBeVisible()
    })

    it('provides the approved English Agora copy', async () => {
        const user = userEvent.setup()
        await i18n.changeLanguage('en')
        render(
            <MemoryRouter>
                <Portfolio />
            </MemoryRouter>
        )
        await user.click(screen.getByRole('tab', {name: /Agora/}))
        const project = screen.getByRole('tabpanel')
        expect(within(project).getByRole('heading', {name: 'Agora — Debate graph'})).toBeVisible()
        expect(within(project).getByText('New project · In development')).toBeVisible()
    })
})
