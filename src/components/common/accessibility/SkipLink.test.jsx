import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import SkipLink from './SkipLink.jsx'

describe('SkipLink', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('targets the main content with a localized label', () => {
        render(<SkipLink />)

        expect(screen.getByRole('navigation', {name: 'Accès rapide'})).toBeVisible()
        expect(screen.getByRole('link', {name: 'Aller au contenu principal'})).toHaveAttribute(
            'href',
            '#main'
        )
    })

    it('is the first keyboard-accessible control', async () => {
        const user = userEvent.setup()

        render(
            <>
                <SkipLink />
                <main id="main" tabIndex="-1" />
                <a href="/next">Lien suivant</a>
            </>
        )

        await user.tab()

        expect(screen.getByRole('link', {name: 'Aller au contenu principal'})).toHaveFocus()
    })
})
