import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

describe('LanguageSwitcher', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('is keyboard accessible and switches to English', async () => {
        const user = userEvent.setup()
        render(<LanguageSwitcher/>)

        const switcher = screen.getByRole('button', {name: 'Switch to English'})
        switcher.focus()
        await user.keyboard('{Enter}')

        await waitFor(() => expect(i18n.resolvedLanguage).toBe('en'))
    })
})
