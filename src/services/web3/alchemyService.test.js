import {afterEach, describe, expect, it, vi} from 'vitest'
import {callAlchemy} from './alchemyService.js'

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
