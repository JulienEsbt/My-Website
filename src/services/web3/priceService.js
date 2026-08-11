const COINGECKO_IDS = Object.freeze({
    ETH: 'ethereum',
    WETH: 'ethereum',
    BTC: 'bitcoin',
    WBTC: 'wrapped-bitcoin',
    USDC: 'usd-coin',
    USDT: 'tether',
    DAI: 'dai',
    LINK: 'chainlink',
    AAVE: 'aave',
    UNI: 'uniswap',
    ARB: 'arbitrum',
    OP: 'optimism',
    BNB: 'binancecoin',
    MATIC: 'matic-network',
    POL: 'polygon-ecosystem-token',
})

export async function fetchIndicativePrices(symbols, signal) {
    const ids = [
        ...new Set(symbols.map((symbol) => COINGECKO_IDS[symbol?.toUpperCase()]).filter(Boolean)),
    ]

    if (!ids.length) return {}

    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`,
        {signal}
    )

    if (!response.ok) return {}
    return response.json()
}

// Association provisoire par symbole, conservée sans changement jusqu’à la refonte de sécurité phase 7.
export function getIndicativeUsdPrice(prices, symbol) {
    const coinId = COINGECKO_IDS[symbol?.toUpperCase()]
    return coinId && prices[coinId]?.usd ? prices[coinId].usd : 0
}
