const COINGECKO_NETWORKS = Object.freeze({
    ethereum: {nativeId: 'ethereum', platformId: 'ethereum'},
    polygon: {nativeId: 'polygon-ecosystem-token', platformId: 'polygon-pos'},
    arbitrum: {nativeId: 'ethereum', platformId: 'arbitrum-one'},
    optimism: {nativeId: 'ethereum', platformId: 'optimistic-ethereum'},
    bnb: {nativeId: 'binancecoin', platformId: 'binance-smart-chain'},
})

const CONTRACT_BATCH_SIZE = 35
const REQUEST_TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 250

const delay = (milliseconds, signal) =>
    new Promise((resolve, reject) => {
        const timeout = window.setTimeout(resolve, milliseconds)
        signal?.addEventListener(
            'abort',
            () => {
                window.clearTimeout(timeout)
                reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
            },
            {once: true}
        )
    })

function withTimeout(signal) {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal
}

async function fetchJsonWithRetry(url, signal, fetchImpl) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
        const response = await fetchImpl(url, {signal: withTimeout(signal)})
        if (response.ok) return response.json()

        const canRetry = attempt === 0 && (response.status === 429 || response.status >= 500)
        if (!canRetry) throw new Error(`PRICE_PROVIDER_${response.status}`)
        await delay(RETRY_DELAY_MS, signal)
    }

    return {}
}

function chunk(items, size) {
    return Array.from({length: Math.ceil(items.length / size)}, (_, index) =>
        items.slice(index * size, (index + 1) * size)
    )
}

export async function fetchWalletPrices({networkId, tokenContracts, signal, fetchImpl = fetch}) {
    const configuration = COINGECKO_NETWORKS[networkId]
    if (!configuration) return {nativePriceUsd: 0, tokenPricesByContract: {}, partial: true}

    const contracts = [
        ...new Set(tokenContracts.map((contract) => contract?.toLowerCase()).filter(Boolean)),
    ]
    let partial = false

    const nativePromise = fetchJsonWithRetry(
        `https://api.coingecko.com/api/v3/simple/price?ids=${configuration.nativeId}&vs_currencies=usd`,
        signal,
        fetchImpl
    ).catch((error) => {
        if (signal?.aborted) throw error
        partial = true
        return {}
    })

    const tokenPricesByContract = {}
    const batches = chunk(contracts, CONTRACT_BATCH_SIZE)
    for (let index = 0; index < batches.length; index += 2) {
        const results = await Promise.all(
            batches.slice(index, index + 2).map((addresses) => {
                const params = new URLSearchParams({
                    contract_addresses: addresses.join(','),
                    vs_currencies: 'usd',
                })
                const url = `https://api.coingecko.com/api/v3/simple/token_price/${configuration.platformId}?${params}`
                return fetchJsonWithRetry(url, signal, fetchImpl).catch((error) => {
                    if (signal?.aborted) throw error
                    partial = true
                    return {}
                })
            })
        )

        results.forEach((prices) => {
            Object.entries(prices).forEach(([contract, price]) => {
                if (Number.isFinite(price?.usd) && price.usd > 0) {
                    tokenPricesByContract[contract.toLowerCase()] = price.usd
                }
            })
        })
    }

    const nativePrices = await nativePromise
    const nativePriceUsd = Number(nativePrices[configuration.nativeId]?.usd) || 0
    if (!nativePriceUsd) partial = true

    return {nativePriceUsd, tokenPricesByContract, partial}
}
