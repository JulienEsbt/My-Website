import {afterEach, describe, expect, it, vi} from 'vitest'
import {callAlchemy, fetchWalletNfts} from './alchemyService.js'

describe('callAlchemy', () => {
    afterEach(() => vi.restoreAllMocks())

    it('returns the JSON-RPC result', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({result: {tokenBalances: []}}),
        })

        await expect(
            callAlchemy('https://example.test/v2/public-key', 'alchemy_getTokenBalances', ['0x1'])
        ).resolves.toEqual({tokenBalances: []})
    })

    it('rejects a provider error without exposing request data', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({error: {message: 'Provider unavailable'}}),
        })

        await expect(callAlchemy('https://example.test', 'method', [])).rejects.toThrow(
            'Provider unavailable'
        )
    })
})

describe('fetchWalletNfts', () => {
    afterEach(() => vi.restoreAllMocks())
    const rpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/test-key'
    const nft = (id) => ({contract: {address: '0xcollection'}, tokenId: id, name: `NFT ${id}`})
    const response = (data) => ({ok: true, json: async () => data})

    it('distinguishes a provider failure from an empty wallet', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({ok: false, status: 500})
        await expect(fetchWalletNfts(rpcUrl, '0xowner')).resolves.toEqual({
            items: [],
            totalCount: null,
            status: 'unavailable',
        })
    })

    it('follows pagination, retains NFTs without images and removes duplicates', async () => {
        const fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                response({ownedNfts: [nft('1')], totalCount: 2, pageKey: 'next / page'})
            )
            .mockResolvedValueOnce(response({ownedNfts: [nft('1'), nft('2')], totalCount: 2}))
        const result = await fetchWalletNfts(rpcUrl, '0xowner')
        expect(result.status).toBe('complete')
        expect(result.totalCount).toBe(2)
        expect(result.items).toHaveLength(2)
        expect(result.items[0].image).toBe('')
        expect(new URL(fetch.mock.calls[1][0]).searchParams.get('pageKey')).toBe('next / page')
    })

    it('reports a partial collection if a later page fails', async () => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                response({ownedNfts: [nft('1')], totalCount: 20, pageKey: 'next'})
            )
            .mockResolvedValueOnce({ok: false})
        const result = await fetchWalletNfts(rpcUrl, '0xowner')
        expect(result).toMatchObject({totalCount: 20, status: 'partial'})
        expect(result.items).toHaveLength(1)
    })

    it('bounds pagination and preserves the provider total', async () => {
        let page = 0
        const fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(async () =>
                response({
                    ownedNfts: [nft(String(++page))],
                    totalCount: 1000,
                    pageKey: String(page),
                })
            )
        const result = await fetchWalletNfts(rpcUrl, '0xowner')
        expect(result).toMatchObject({totalCount: 1000, status: 'partial'})
        expect(fetch).toHaveBeenCalledTimes(5)
    })

    it('preserves cancellation rather than returning an empty result', async () => {
        const controller = new AbortController()
        controller.abort()
        await expect(fetchWalletNfts(rpcUrl, '0xowner', controller.signal)).rejects.toMatchObject({
            name: 'AbortError',
        })
    })
})
