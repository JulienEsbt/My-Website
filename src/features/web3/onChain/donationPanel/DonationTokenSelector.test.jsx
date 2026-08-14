import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import DonationTokenSelector from './DonationTokenSelector.jsx'

const tokens = [
    {id: 'eth', symbol: 'ETH', networkName: 'Ethereum', type: 'native'},
    {id: 'usdc', symbol: 'USDC', networkName: 'Polygon', type: 'erc20'},
]

describe('DonationTokenSelector', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('exposes search and token selection as accessible controls', async () => {
        const user = userEvent.setup()
        const onSearch = vi.fn()
        const onSelect = vi.fn()

        render(
            <DonationTokenSelector
                filteredTokens={tokens}
                search=""
                selectedTokenId="eth"
                onSearch={onSearch}
                onSelect={onSelect}
            />
        )

        await user.type(screen.getByRole('searchbox'), 'pol')
        await user.click(screen.getByRole('button', {name: /USDCPolygon/i}))

        expect(onSearch).toHaveBeenCalled()
        expect(onSelect).toHaveBeenCalledWith('usdc')
        expect(screen.getByRole('button', {name: /ETHEthereum/i})).toHaveAttribute(
            'aria-pressed',
            'true'
        )
    })
})
