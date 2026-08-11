import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import WalletInspector from './WalletInspector.jsx'

vi.mock('../../../../services/web3/walletInspectorService.js', () => ({
    connectInjectedWallet: vi.fn(),
    inspectWalletPortfolio: vi.fn(() =>
        Promise.resolve({
            address: '0x1234567890123456789012345678901234567890',
            ens: null,
            avatar: null,
            network: {name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io'},
            nativeBalance: 1,
            nativeValueUsd: 2000,
            portfolioValueUsd: 2050,
            tokenCount: 1,
            pricedTokenCount: 1,
            nftCount: 0,
            topHolding: {symbol: 'ETH', valueUsd: 2000, allocation: 97.56},
            topTokens: [
                {
                    contract: '0xtoken',
                    name: 'USD Coin',
                    symbol: 'USDC',
                    balance: '50',
                    valueUsd: 50,
                    allocation: 2.44,
                },
            ],
            allTokens: [
                {
                    contract: '0xtoken',
                    name: 'USD Coin',
                    symbol: 'USDC',
                    balance: '50',
                    valueUsd: 50,
                    allocation: 2.44,
                },
            ],
            allocationItems: [{symbol: 'ETH', valueUsd: 2000, allocation: 97.56}],
            nfts: [],
        })
    ),
}))

describe('WalletInspector', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('loads inspection logic on demand and exposes the token dialog to the keyboard', async () => {
        const user = userEvent.setup()
        render(<WalletInspector />)

        await user.type(
            screen.getByLabelText('Adresse de wallet ou nom ENS'),
            '0x1234567890123456789012345678901234567890'
        )
        await user.click(screen.getByRole('button', {name: 'Analyser'}))

        expect(await screen.findByText('$2,050')).toBeVisible()
        await user.click(screen.getByRole('button', {name: /Tout voir · 1/}))

        expect(await screen.findByRole('dialog', {name: 'Tokens'})).toBeVisible()
        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })
})
