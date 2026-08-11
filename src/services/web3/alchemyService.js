export async function callAlchemy(rpcUrl, method, params, signal) {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        signal,
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params,
        }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(`RPC request failed with status ${response.status}`)
    if (data.error) throw new Error(data.error.message)

    return data.result
}

function getAlchemyNftUrl(rpcUrl, owner) {
    const apiKey = rpcUrl.split('/v2/')[1]
    const network = rpcUrl.split('https://')[1].split('.g.alchemy.com')[0]

    return `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${owner}&withMetadata=true&pageSize=12`
}

export async function fetchWalletNfts(rpcUrl, owner, signal) {
    try {
        const response = await fetch(getAlchemyNftUrl(rpcUrl, owner), {signal})
        if (!response.ok) return []

        const data = await response.json()

        return (data.ownedNfts ?? [])
            .map((nft) => ({
                id: `${nft.contract?.address}-${nft.tokenId}`,
                name: nft.name || nft.title || 'NFT',
                collection: nft.collection?.name || nft.contract?.name || 'Unknown collection',
                image:
                    nft.image?.cachedUrl ||
                    nft.image?.pngUrl ||
                    nft.image?.thumbnailUrl ||
                    nft.raw?.metadata?.image ||
                    '',
                contract: nft.contract?.address,
                tokenId: nft.tokenId,
            }))
            .filter((nft) => nft.image)
    } catch (error) {
        if (signal?.aborted) throw error
        return []
    }
}
