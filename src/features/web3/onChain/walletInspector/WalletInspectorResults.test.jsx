import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import WalletInspectorResults from './WalletInspectorResults.jsx'

const result = {
    address: '0x1234567890123456789012345678901234567890',
    network: {name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io'},
    nativeBalance: 1,
    nativeValueUsd: 0,
    portfolioValueUsd: 0,
    tokenCount: 0,
    pricedTokenCount: 0,
    nftCount: 0,
    nfts: [],
    topTokens: [],
    allocationItems: [],
}
describe('unavailable portfolio valuation', () => {
    it('does not display a zero portfolio value when pricing failed', () => {
        const {container} = render(
            <WalletInspectorResults result={{...result, valuationPartial: true}} comparison={[]} />
        )
        expect(
            container.querySelector('.wallet-inspector__metric--value strong')
        ).toHaveTextContent('—')
        expect(screen.getByRole('status')).toBeInTheDocument()
    })
    it('retains a real zero when the valuation is complete', () => {
        const {container} = render(
            <WalletInspectorResults
                result={{...result, nativeBalance: 0, valuationPartial: false}}
                comparison={[]}
            />
        )
        expect(
            container.querySelector('.wallet-inspector__metric--value strong')
        ).toHaveTextContent('0')
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
})
