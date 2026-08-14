import {afterEach, describe, expect, it, vi} from 'vitest'
import {fetchBlockchainStatuses} from './blockchainStatusService.js'

describe('blockchain status service', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('loads statuses from the same-origin server endpoint', async () => {
        const networks = [{id: 'ethereum', status: 'online'}]
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ok: true, networks}),
        })
        vi.stubGlobal('fetch', fetchMock)

        await expect(fetchBlockchainStatuses()).resolves.toEqual(networks)
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/blockchain-status',
            expect.objectContaining({method: 'GET'})
        )
    })

    it('returns a generic error for invalid server responses', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({ok: false, json: vi.fn().mockResolvedValue(null)})
        )

        await expect(fetchBlockchainStatuses()).rejects.toThrow('BLOCKCHAIN_STATUS_UNAVAILABLE')
    })
})
