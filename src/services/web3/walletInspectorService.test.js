import {describe, expect, it} from 'vitest'
import {valueWalletPortfolio} from './walletInspectorService.js'

describe('valueWalletPortfolio', () => {
    it('keeps unpriced tokens without including them in the indicative total', () => {
        const result = valueWalletPortfolio({
            nativeBalance: 2,
            network: {symbol: 'ETH'},
            prices: {ethereum: {usd: 2000}, 'usd-coin': {usd: 1}},
            tokens: [
                {contract: '0x1', symbol: 'USDC', balanceNumber: 50, balance: '50'},
                {contract: '0x2', symbol: 'UNKNOWN', balanceNumber: 10, balance: '10'},
            ],
        })

        expect(result.portfolioValueUsd).toBe(4050)
        expect(result.pricedTokenCount).toBe(1)
        expect(result.allTokens).toHaveLength(2)
        expect(result.allTokens.at(-1)).toMatchObject({symbol: 'UNKNOWN', valueUsd: 0})
        expect(result.topHolding).toMatchObject({symbol: 'ETH', valueUsd: 4000})
    })
})
