import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import {loadNamespace} from '../i18n/i18n.js'
import JournalPage from './JournalPage.jsx'

describe('JournalPage', () => {
    beforeEach(async () => {
        await loadNamespace('journal')
        await i18n.changeLanguage('fr')
    })

    it('shows a chronological feed and filters categories without collecting email', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <JournalPage />
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', {name: 'Journal', level: 1})).toBeInTheDocument()
        expect(screen.getByRole('link', {name: 'RSS'})).toHaveAttribute('href', '/rss.xml')
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Sport'}))

        expect(
            screen.getByRole('heading', {name: 'Pas encore de publication dans cette catégorie'})
        ).toBeInTheDocument()
    })
})
