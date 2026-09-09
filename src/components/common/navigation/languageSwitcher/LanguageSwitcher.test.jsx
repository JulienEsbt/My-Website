import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

describe('LanguageSwitcher', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })
    it('links to a stable English URL and preserves trip selection and anchor', () => {
        render(
            <MemoryRouter initialEntries={['/travel?trip=croatia-2026&lang=fr#stories']}>
                <LanguageSwitcher />
            </MemoryRouter>
        )
        const link = screen.getByRole('link', {name: 'Switch to English'})
        expect(link).toHaveAttribute('href', '/en/travel?trip=croatia-2026#stories')
        expect(link).toHaveAttribute('hreflang', 'en')
        link.focus()
        expect(link).toHaveFocus()
    })
    it('links back to the existing French URL', async () => {
        await i18n.changeLanguage('en')
        render(
            <MemoryRouter initialEntries={['/reflections/charte-de-pensee']}>
                <LanguageSwitcher />
            </MemoryRouter>
        )
        expect(screen.getByRole('link', {name: 'Passer en français'})).toHaveAttribute(
            'href',
            '/reflections/charte-de-pensee'
        )
    })
})
