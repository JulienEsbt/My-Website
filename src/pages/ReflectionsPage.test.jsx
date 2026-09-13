import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import ReflectionsPage from './ReflectionsPage.jsx'

vi.mock('../components/common/navigation/pageNav/PageNav.jsx', () => ({default: () => null}))
vi.mock('../components/common/layout/footerSection/Footer.jsx', () => ({default: () => null}))
vi.mock('../features/reflections/reflectionsNav/ReflectionsNav.jsx', () => ({
    default: () => null,
}))
vi.mock('../features/reflections/reflectionStats/ReflectionStats.jsx', () => ({
    default: () => null,
}))
vi.mock('../features/reflections/reflectionAuthor/ReflectionAuthor.jsx', () => ({
    default: () => null,
}))
vi.mock('../features/reflections/reflectionCard/ReflectionCard.jsx', () => ({
    default: ({reflexion, language}) => <article>{reflexion.title[language]}</article>,
}))

const renderPage = () =>
    render(
        <MemoryRouter>
            <ReflectionsPage />
        </MemoryRouter>
    )

describe('ReflectionsPage', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('filters the editorial list and announces the result count', async () => {
        const user = userEvent.setup()
        renderPage()

        const list = screen.getByRole('heading', {name: 'Dernières réflexions'}).closest('section')
        expect(within(list).getAllByRole('article')).toHaveLength(3)

        await user.type(
            screen.getByRole('textbox', {name: 'Rechercher dans les réflexions'}),
            'liberté'
        )

        expect(within(list).getAllByRole('article')).toHaveLength(1)
        expect(within(list).getByText('Vérité, liberté et construction de soi')).toBeVisible()
        expect(screen.getByRole('status')).toHaveTextContent('1 réflexion trouvée')
    })

    it('keeps all categories visible and prioritizes the featured article', () => {
        renderPage()
        for (const name of ['Tous (3)', 'Politique (0)', 'Société (0)', 'Technologie (0)']) {
            expect(screen.getByRole('button', {name})).toBeInTheDocument()
        }
        expect(screen.getByRole('button', {name: 'Philosophie (3)'})).toBeInTheDocument()
        const list = screen.getByRole('heading', {name: 'Dernières réflexions'}).closest('section')
        expect(within(list).getAllByRole('article')[0]).toHaveTextContent('Charte de pensée')
    })

    it('updates the visible content after a complete language change', async () => {
        renderPage()
        expect(screen.getByRole('heading', {name: 'Dernières réflexions'})).toBeVisible()

        await i18n.changeLanguage('en')

        expect(await screen.findByRole('heading', {name: 'Latest reflections'})).toBeVisible()
        expect(screen.getByText('Charter of thought')).toBeVisible()
    })
})
