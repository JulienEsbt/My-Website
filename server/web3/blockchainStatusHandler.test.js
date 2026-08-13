import {describe, expect, it, vi} from 'vitest'
import {createBlockchainStatusHandler} from './blockchainStatusHandler.js'

function createResponse() {
    const headers = new Map()
    return {
        statusCode: 200,
        body: null,
        headers,
        setHeader(name, value) {
            headers.set(name, value)
        },
        status(code) {
            this.statusCode = code
            return this
        },
        json(body) {
            this.body = body
            return this
        },
    }
}

const rpcPayload = [
    {jsonrpc: '2.0', id: 1, result: '0x64'},
    {jsonrpc: '2.0', id: 2, result: '0x1'},
    {jsonrpc: '2.0', id: 3, result: '0x12a05f200'},
    {jsonrpc: '2.0', id: 4, result: '0x3b9aca00'},
    {jsonrpc: '2.0', id: 5, result: {baseFeePerGas: '0x77359400'}},
]

describe('blockchain status handler', () => {
    it('returns normalized server-side RPC data without exposing provider URLs', async () => {
        const env = {ETH_RPC_URL: 'https://rpc.example/private'}
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(rpcPayload),
        })
        const response = createResponse()

        await createBlockchainStatusHandler({env, fetchImpl})({method: 'GET'}, response)

        expect(response.statusCode).toBe(200)
        expect(response.body.networks[0]).toEqual({
            id: 'ethereum',
            status: 'online',
            chainId: '1',
            blockNumber: 100,
            gasPrice: 5,
            maxFee: 5,
            priorityFee: 1,
        })
        expect(response.body.networks.slice(1)).toEqual(
            expect.arrayContaining([expect.objectContaining({status: 'missing-rpc'})])
        )
        expect(JSON.stringify(response.body)).not.toContain(env.ETH_RPC_URL)
        expect(response.headers.get('Cache-Control')).toContain('s-maxage=15')
    })

    it('returns a generic network error when a provider fails', async () => {
        const response = createResponse()
        const handler = createBlockchainStatusHandler({
            env: {ETH_RPC_URL: 'https://rpc.example/private'},
            fetchImpl: vi.fn().mockRejectedValue(new Error('sensitive provider details')),
        })

        await handler({method: 'GET'}, response)

        expect(response.statusCode).toBe(200)
        expect(response.body.networks[0]).toEqual({id: 'ethereum', status: 'error'})
        expect(JSON.stringify(response.body)).not.toContain('sensitive provider details')
    })

    it('rejects unsupported methods', async () => {
        const response = createResponse()

        await createBlockchainStatusHandler()({method: 'POST'}, response)

        expect(response.statusCode).toBe(405)
        expect(response.body).toEqual({ok: false, code: 'method_not_allowed'})
    })
})
