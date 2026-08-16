import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

describe('LanguageSwitcher', () => {
    beforeEach(async () => {
        window.history.replaceState({}, '', '/?lang=fr')
        await i18n.changeLanguage('fr')
    })

    it('is keyboard accessible and switches to English', async () => {
        const user = userEvent.setup()
        const {container} = render(<LanguageSwitcher />)

        const switcher = screen.getByRole('button', {name: 'Switch to English'})
        expect(container.querySelector('.lang-slider')).toHaveTextContent('🇫🇷')
        expect(container.querySelector('.lang-labels .active')).toHaveTextContent('FR')
        switcher.focus()
        await user.keyboard('{Enter}')

        await waitFor(() => expect(i18n.resolvedLanguage).toBe('en'))
        expect(container.querySelector('.lang-slider')).toHaveTextContent('🇬🇧')
        expect(container.querySelector('.lang-labels .active')).toHaveTextContent('EN')
        expect(document.documentElement).toHaveAttribute('lang', 'en')
        expect(window.location.search).toBe('?lang=en')
    })
})
