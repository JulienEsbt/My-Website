const REQUEST_TIMEOUT_MS = 6000
const CACHE_SECONDS = 15

const NETWORKS = Object.freeze([
    {id: 'ethereum', envName: 'ETH_RPC_URL'},
    {id: 'polygon', envName: 'POLYGON_RPC_URL'},
    {id: 'arbitrum', envName: 'ARBITRUM_RPC_URL'},
    {id: 'optimism', envName: 'OPTIMISM_RPC_URL'},
    {id: 'bnb', envName: 'BNB_RPC_URL'},
])

const RPC_REQUESTS = Object.freeze([
    {jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: []},
    {jsonrpc: '2.0', id: 2, method: 'eth_chainId', params: []},
    {jsonrpc: '2.0', id: 3, method: 'eth_gasPrice', params: []},
    {jsonrpc: '2.0', id: 4, method: 'eth_maxPriorityFeePerGas', params: []},
    {jsonrpc: '2.0', id: 5, method: 'eth_getBlockByNumber', params: ['latest', false]},
])

function sendJson(response, status, body) {
    response.status(status).json(body)
}

function fromHex(value) {
    if (typeof value !== 'string' || !/^0x[0-9a-f]+$/i.test(value)) return null
    return BigInt(value)
}

function toGwei(value) {
    return value == null ? null : Number(value) / 1e9
}

function resultById(payload, id) {
    if (!Array.isArray(payload)) return null
    return payload.find((entry) => entry?.id === id && entry.error == null)?.result ?? null
}

async function fetchNetworkStatus(network, {env, fetchImpl}) {
    const rpcUrl = env[network.envName]
    if (!rpcUrl) return {id: network.id, status: 'missing-rpc'}

    try {
        const response = await fetchImpl(rpcUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(RPC_REQUESTS),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        })
        if (!response.ok) throw new Error('RPC request failed')

        const payload = await response.json()
        const blockNumber = fromHex(resultById(payload, 1))
        const chainId = fromHex(resultById(payload, 2))
        const gasPrice = fromHex(resultById(payload, 3))
        const priorityFee = fromHex(resultById(payload, 4))
        const latestBlock = resultById(payload, 5)
        const baseFee = fromHex(latestBlock?.baseFeePerGas)

        if (blockNumber == null || chainId == null || gasPrice == null) {
            throw new Error('Incomplete RPC response')
        }

        return {
            id: network.id,
            status: 'online',
            chainId: chainId.toString(),
            blockNumber: Number(blockNumber),
            gasPrice: toGwei(gasPrice),
            maxFee: toGwei(
                baseFee != null && priorityFee != null ? baseFee * 2n + priorityFee : gasPrice
            ),
            priorityFee: toGwei(priorityFee),
        }
    } catch {
        return {id: network.id, status: 'error'}
    }
}

async function mapWithConcurrency(items, concurrency, task) {
    const results = new Array(items.length)
    let nextIndex = 0

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex++
            results[index] = await task(items[index])
        }
    }

    await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, worker))
    return results
}

export function createBlockchainStatusHandler({env = process.env, fetchImpl = fetch} = {}) {
    return async function blockchainStatusHandler(request, response) {
        response.setHeader(
            'Cache-Control',
            `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=30`
        )

        if (request.method !== 'GET') {
            response.setHeader('Allow', 'GET')
            return sendJson(response, 405, {ok: false, code: 'method_not_allowed'})
        }

        const networks = await mapWithConcurrency(NETWORKS, 2, (network) =>
            fetchNetworkStatus(network, {env, fetchImpl})
        )

        return sendJson(response, 200, {ok: true, networks})
    }
}
