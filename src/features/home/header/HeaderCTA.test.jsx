import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import HeaderCTA from './HeaderCTA.jsx'

describe('HeaderCTA', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('en')
    })

    it('maps each label to the expected action', () => {
        render(
            <MemoryRouter>
                <HeaderCTA/>
            </MemoryRouter>
        )

        expect(screen.getByRole('link', {name: 'Contact me'})).toHaveAttribute('href', '#contact')
        expect(screen.getByRole('link', {name: 'Explore Web3'})).toHaveAttribute('href', '/web3')
        expect(screen.getByRole('link', {name: 'Open resume'}).getAttribute('href')).toContain('cv.pdf')
    })
})
