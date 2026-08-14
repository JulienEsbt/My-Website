import {describe, expect, it} from 'vitest'
import {valueWalletPortfolio} from './walletInspectorService.js'

describe('valueWalletPortfolio', () => {
    it('keeps unpriced tokens without including them in the indicative total', () => {
        const result = valueWalletPortfolio({
            nativeBalance: 2,
            network: {id: 'ethereum', symbol: 'ETH'},
            nativePriceUsd: 2000,
            tokenPricesByContract: {'0xverified': 1},
            tokens: [
                {
                    contract: '0xVerified',
                    symbol: 'USDC',
                    balanceNumber: 50,
                    balance: '50',
                },
                {
                    contract: '0xImpostor',
                    symbol: 'USDC',
                    balanceNumber: 10,
                    balance: '10',
                },
            ],
        })

        expect(result.portfolioValueUsd).toBe(4050)
        expect(result.pricedTokenCount).toBe(1)
        expect(result.allTokens).toHaveLength(2)
        expect(result.allocationItems.map((item) => item.id)).toEqual([
            'native-ethereum',
            'ethereum-0xverified',
        ])
        expect(result.allTokens.at(-1)).toMatchObject({contract: '0xImpostor', valueUsd: 0})
        expect(result.topHolding).toMatchObject({symbol: 'ETH', valueUsd: 4000})
    })
})
