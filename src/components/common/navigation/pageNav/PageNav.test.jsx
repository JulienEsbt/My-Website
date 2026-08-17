import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it} from 'vitest'
import {MemoryRouter} from 'react-router-dom'
import i18n from 'i18next'
import PageNav from './PageNav.jsx'

describe('PageNav', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('opens the menu and marks the current route', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={['/travel']}>
                <PageNav />
            </MemoryRouter>
        )

        await user.click(screen.getByRole('button', {name: 'Ouvrir la navigation'}))

        const closeButton = screen.getByRole('button', {name: 'Fermer la navigation'})
        expect(closeButton).toHaveAttribute('aria-expanded', 'true')
        expect(closeButton).toHaveAttribute('aria-controls', 'primary-navigation')
        expect(screen.getByRole('link', {name: 'Carnets de voyage'})).toHaveAttribute(
            'aria-current',
            'page'
        )
        await waitFor(() => expect(screen.getByRole('link', {name: 'Portfolio'})).toHaveFocus())
    })

    it('closes the menu with Escape', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <PageNav />
            </MemoryRouter>
        )

        const openButton = screen.getByRole('button', {name: 'Ouvrir la navigation'})
        await user.click(openButton)
        await user.keyboard('{Escape}')

        expect(screen.queryByRole('link', {name: 'Labs Web3'})).not.toBeInTheDocument()
        expect(openButton).toHaveFocus()
    })

    it('keeps controls outside the open navigation interactive', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <PageNav />
            </MemoryRouter>
        )

        await user.click(screen.getByRole('button', {name: 'Ouvrir la navigation'}))
        await waitFor(() => expect(screen.getByRole('link', {name: 'Portfolio'})).toHaveFocus())
        await user.click(screen.getByRole('button', {name: 'Switch to English'}))

        expect(i18n.resolvedLanguage).toBe('en')
        expect(screen.queryByRole('link', {name: 'Labs Web3'})).not.toBeInTheDocument()
    })
})
