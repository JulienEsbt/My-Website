import type {AlchemyTokenBalancesResult, AlchemyTokenMetadata, WalletNft} from '../../types/web3'

interface JsonRpcError {
    message: string
}

interface JsonRpcResponse {
    result?: unknown
    error?: JsonRpcError
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isRpcResponse = (value: unknown): value is JsonRpcResponse => isRecord(value)

export async function callAlchemy<T = unknown>(
    rpcUrl: string,
    method: string,
    params: readonly unknown[],
    signal?: AbortSignal
): Promise<T> {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        ...(signal ? {signal} : {}),
        body: JSON.stringify({jsonrpc: '2.0', id: Date.now(), method, params}),
    })

    const data: unknown = await response.json()
    if (!response.ok) throw new Error(`RPC request failed with status ${response.status}`)
    if (!isRpcResponse(data)) throw new Error('INVALID_RPC_RESPONSE')
    if (data.error) throw new Error(data.error.message)

    return data.result as T
}

function getAlchemyNftUrl(rpcUrl: string, owner: string): string | null {
    try {
        const url = new URL(rpcUrl)
        const apiKey = url.pathname.split('/v2/')[1]
        const network = url.hostname.split('.g.alchemy.com')[0]
        if (!apiKey || !network || !url.hostname.endsWith('.g.alchemy.com')) return null

        return `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${encodeURIComponent(owner)}&withMetadata=true&pageSize=12`
    } catch {
        return null
    }
}

function parseNft(value: unknown): WalletNft | null {
    if (!isRecord(value)) return null
    const contract = isRecord(value.contract) ? value.contract : {}
    const collection = isRecord(value.collection) ? value.collection : {}
    const image = isRecord(value.image) ? value.image : {}
    const raw = isRecord(value.raw) ? value.raw : {}
    const metadata = isRecord(raw.metadata) ? raw.metadata : {}

    const contractAddress = typeof contract.address === 'string' ? contract.address : undefined
    const tokenId = typeof value.tokenId === 'string' ? value.tokenId : undefined
    const imageUrl = [image.cachedUrl, image.pngUrl, image.thumbnailUrl, metadata.image].find(
        (candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0
    )
    if (!imageUrl) return null

    return {
        id: `${contractAddress ?? 'unknown'}-${tokenId ?? 'unknown'}`,
        name:
            (typeof value.name === 'string' && value.name) ||
            (typeof value.title === 'string' && value.title) ||
            'NFT',
        collection:
            (typeof collection.name === 'string' && collection.name) ||
            (typeof contract.name === 'string' && contract.name) ||
            'Unknown collection',
        image: imageUrl,
        ...(contractAddress ? {contract: contractAddress} : {}),
        ...(tokenId ? {tokenId} : {}),
    }
}

export async function fetchWalletNfts(
    rpcUrl: string,
    owner: string,
    signal?: AbortSignal
): Promise<WalletNft[]> {
    try {
        const url = getAlchemyNftUrl(rpcUrl, owner)
        if (!url) return []

        const response = await fetch(url, signal ? {signal} : undefined)
        if (!response.ok) return []

        const data: unknown = await response.json()
        if (!isRecord(data) || !Array.isArray(data.ownedNfts)) return []
        return data.ownedNfts.map(parseNft).filter((nft): nft is WalletNft => nft !== null)
    } catch (error) {
        if (signal?.aborted) throw error
        return []
    }
}

export type {AlchemyTokenBalancesResult, AlchemyTokenMetadata}
