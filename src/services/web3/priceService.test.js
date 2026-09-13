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
            .mockResolvedValueOnce(response({}))

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
        expect(fetchImpl.mock.calls[1][0].toLowerCase()).toContain('contract_addresses=0xverified&')
        expect(fetchImpl.mock.calls[2][0].toLowerCase()).toContain('contract_addresses=0xunknown&')
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

describe('short-lived price reuse', () => {
    it('reuses a successful quote between consecutive wallet searches, then refreshes it', async () => {
        vi.useFakeTimers()
        try {
            const fetchImpl = vi.fn().mockResolvedValue(response({ethereum: {usd: 2500}}))
            const options = {networkId: 'ethereum', tokenContracts: [], fetchImpl}
            expect((await fetchWalletPrices(options)).nativePriceUsd).toBe(2500)
            expect((await fetchWalletPrices(options)).nativePriceUsd).toBe(2500)
            expect(fetchImpl).toHaveBeenCalledTimes(1)
            vi.advanceTimersByTime(60_001)
            fetchImpl.mockResolvedValue(response({}, 400))
            expect(await fetchWalletPrices(options)).toMatchObject({
                nativePriceUsd: 0,
                partial: true,
            })
            expect(fetchImpl).toHaveBeenCalledTimes(2)
        } finally {
            vi.useRealTimers()
        }
    })
    it('does not cache failed quotes or bypass cancellation', async () => {
        const fetchImpl = vi
            .fn()
            .mockResolvedValueOnce(response({}, 400))
            .mockResolvedValue(response({ethereum: {usd: 2400}}))
        const options = {networkId: 'ethereum', tokenContracts: [], fetchImpl}
        expect((await fetchWalletPrices(options)).partial).toBe(true)
        expect((await fetchWalletPrices(options)).nativePriceUsd).toBe(2400)
        await expect(fetchWalletPrices({...options, signal: AbortSignal.abort()})).rejects.toThrow()
    })
})

it('bounds public token price lookups and marks the rest as partial', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ethereum: {usd: 2500}}))
    const result = await fetchWalletPrices({
        networkId: 'ethereum',
        tokenContracts: Array.from({length: 25}, (_, i) => `0x${i}`),
        fetchImpl,
    })
    expect(fetchImpl).toHaveBeenCalledTimes(21)
    expect(result.partial).toBe(true)
})
