import {FiGlobe} from 'react-icons/fi'
import {
    SiBitcoin,
    SiEthereum,
    SiBinance,
    SiSolana,
    SiPolkadot,
    SiCoinmarketcap,
    SiTradingview,
} from 'react-icons/si'

const symbols = {
    Bitcoin: [SiBitcoin, '#f7931a'],
    Ethereum: [SiEthereum, '#a8b8ff'],
    'Binance Smart Chain': [SiBinance, '#f3ba2f'],
    Solana: [SiSolana, '#6cebc4'],
    Polkadot: [SiPolkadot, '#ff65af'],
    CoinMarketCap: [SiCoinmarketcap, '#e4edff'],
    TradingView: [SiTradingview, '#e4edff'],
}
const images = {
    Coin360: 'coin360.ico',
    DefiLlama: 'defillama.ico',
    'Altcoin Season Index': 'blockchaincenter.ico',
    'Scalpex Index': 'scalpex.svg',
    Glassnode: 'glassnode.png',
    ChainList: 'chainlist.ico',
    MultiversX: 'multiversx.png',
    Cosmos: 'cosmos.svg',
}
export default function ResourceLogo({name}) {
    const symbol = symbols[name]
    if (symbol) {
        const Icon = symbol[0]
        return <Icon aria-hidden="true" style={{color: symbol[1]}} />
    }
    if (images[name])
        return (
            <img
                src={`/resource-logos/${images[name]}`}
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
            />
        )
    return <FiGlobe aria-hidden="true" />
}
