import {render, screen} from '@testing-library/react'
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

        expect(screen.getByRole('link', {name: 'Voyages'})).toHaveAttribute(
            'aria-current',
            'page'
        )
        expect(screen.getByRole('button', {name: 'Fermer la navigation'})).toBeVisible()
    })

    it('closes the menu with Escape', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <PageNav />
            </MemoryRouter>
        )

        await user.click(screen.getByRole('button', {name: 'Ouvrir la navigation'}))
        await user.keyboard('{Escape}')

        expect(screen.queryByRole('link', {name: 'Web3'})).not.toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Ouvrir la navigation'})).toBeVisible()
    })
})
