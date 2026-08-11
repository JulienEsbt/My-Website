import {afterEach, describe, expect, it, vi} from 'vitest'
import {fetchIndicativePrices, getIndicativeUsdPrice} from './priceService.js'

describe('priceService', () => {
    afterEach(() => vi.restoreAllMocks())

    it('does not call the provider when no supported symbol is provided', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch')

        await expect(fetchIndicativePrices(['UNKNOWN'])).resolves.toEqual({})
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('reads the existing indicative symbol mapping', () => {
        const prices = {ethereum: {usd: 2500}}

        expect(getIndicativeUsdPrice(prices, 'ETH')).toBe(2500)
        expect(getIndicativeUsdPrice(prices, 'UNKNOWN')).toBe(0)
    })
})
