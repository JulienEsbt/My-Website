import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import SkipLink from './SkipLink.jsx'

describe('SkipLink', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('targets the main content with a localized label', () => {
        render(<SkipLink />)

        expect(screen.getByRole('link', {name: 'Aller au contenu principal'})).toHaveAttribute(
            'href',
            '#main'
        )
    })
})
