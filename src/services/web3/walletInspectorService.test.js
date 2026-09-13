import {describe, expect, it, vi} from 'vitest'
import {valueWalletPortfolio, resolveWalletInput} from './walletInspectorService.js'

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

describe('ENS resolution', () => {
    const network = {id: 'ethereum'}
    it('distinguishes a provider outage from an unassigned name', async () => {
        const provider = {resolveName: vi.fn().mockRejectedValue(new Error('RPC unavailable'))}
        await expect(
            resolveWalletInput({provider, input: 'julienesbt.eth', network})
        ).rejects.toThrow('ENS_UNAVAILABLE')
        provider.resolveName.mockResolvedValue(null)
        await expect(
            resolveWalletInput({provider, input: 'unassigned.eth', network})
        ).resolves.toBeNull()
    })
    it('resolves an ENS identity even if its optional avatar fails', async () => {
        const provider = {
            resolveName: vi.fn().mockResolvedValue('0x123'),
            getAvatar: vi.fn().mockRejectedValue(new Error('avatar unavailable')),
        }
        await expect(
            resolveWalletInput({provider, input: ' julienesbt.eth ', network})
        ).resolves.toEqual({address: '0x123', ens: 'julienesbt.eth', avatar: null})
    })
})

it('resolves the same public address from ENS and hexadecimal input', async () => {
    const address = '0x1234567890123456789012345678901234567890'
    const provider = {
        resolveName: vi.fn().mockResolvedValue(address),
        lookupAddress: vi.fn().mockResolvedValue('example.eth'),
        getAvatar: vi.fn().mockResolvedValue(null),
    }
    const network = {id: 'ethereum'}
    const named = await resolveWalletInput({provider, input: 'example.eth', network})
    const direct = await resolveWalletInput({provider, input: address, network})
    expect(named.address).toBe(direct.address)
})
