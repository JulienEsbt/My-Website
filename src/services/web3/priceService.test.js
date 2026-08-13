import {describe, expect, it, vi} from 'vitest'
import {fetchWalletPrices} from './priceService.js'

const response = (body, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
})

describe('fetchWalletPrices', () => {
    it('prices tokens by network and contract address', async () => {
        const fetchImpl = vi
            .fn()
            .mockResolvedValueOnce(response({ethereum: {usd: 2500}}))
            .mockResolvedValueOnce(response({'0xverified': {usd: 1}}))

        const result = await fetchWalletPrices({
            networkId: 'ethereum',
            tokenContracts: ['0xVerified', '0xUnknown'],
            fetchImpl,
        })

        expect(result).toEqual({
            nativePriceUsd: 2500,
            tokenPricesByContract: {'0xverified': 1},
            partial: false,
        })
        expect(fetchImpl.mock.calls[1][0]).toContain('/simple/token_price/ethereum?')
        expect(fetchImpl.mock.calls[1][0].toLowerCase()).toContain('0xverified%2c0xunknown')
    })

    it('returns partial data without inventing prices when the provider fails', async () => {
        const fetchImpl = vi
            .fn()
            .mockResolvedValueOnce(response({ethereum: {usd: 2500}}))
            .mockResolvedValueOnce(response({}, 400))

        await expect(
            fetchWalletPrices({
                networkId: 'ethereum',
                tokenContracts: ['0xUnknown'],
                fetchImpl,
            })
        ).resolves.toEqual({
            nativePriceUsd: 2500,
            tokenPricesByContract: {},
            partial: true,
        })
    })

    it('retries a temporary provider failure once', async () => {
        vi.useFakeTimers()
        const fetchImpl = vi
            .fn()
            .mockResolvedValueOnce(response({}, 429))
            .mockResolvedValueOnce(response({ethereum: {usd: 2500}}))

        const promise = fetchWalletPrices({
            networkId: 'ethereum',
            tokenContracts: [],
            fetchImpl,
        })
        await vi.runAllTimersAsync()

        await expect(promise).resolves.toMatchObject({nativePriceUsd: 2500, partial: false})
        expect(fetchImpl).toHaveBeenCalledTimes(2)
        vi.useRealTimers()
    })
})
