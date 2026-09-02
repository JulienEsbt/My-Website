import type {ExternalLink} from '../types/domain'

const toolLinks = {
    others: [
        {name: 'CoinMarketCap', url: 'https://coinmarketcap.com/'},
        {name: 'TradingView', url: 'https://www.tradingview.com/'},
        {name: 'Coin360', url: 'https://coin360.com/'},
        {name: 'DefiLlama', url: 'https://defillama.com/'},
        {
            name: 'Altcoin Season Index',
            url: 'https://www.blockchaincenter.net/altcoin-season-index/',
        },
        {name: 'Scalpex Index', url: 'https://scalpexindex.com/app/'},
        {name: 'Glassnode', url: 'https://studio.glassnode.com/'},
        {name: 'ChainList', url: 'https://chainlist.org/'},
    ],
    explorers: [
        {name: 'Bitcoin', url: 'https://mempool.space/'},
        {name: 'Ethereum', url: 'https://etherscan.io/'},
        {name: 'Binance Smart Chain', url: 'https://www.bscscan.com/'},
        {name: 'MultiversX', url: 'https://explorer.multiversx.com/'},
        {name: 'Solana', url: 'https://explorer.solana.com/'},
        {name: 'Polkadot', url: 'https://polkadot.subscan.io/'},
        {name: 'Cosmos', url: 'https://www.mintscan.io/cosmos'},
    ],
} as const satisfies Record<string, readonly ExternalLink[]>

export const LINKS = {
    social: {
        linkedin: 'https://www.linkedin.com/in/julien-esterbet/',
        github: 'https://github.com/JulienEsbt',
        twitter: 'https://twitter.com/Julien_Esbt_Pro',
        instagramPersonal: 'https://www.instagram.com/julien.esbt/',
    },
    tools: toolLinks,
    mail: {personal: 'julien.esterbet@gmail.com'},
    projects: {
        brunoPizza: 'https://github.com/JulienEsbt/bruno-pizza-production',
        myWebsite: 'https://github.com/JulienEsbt/My-Website',
        megalis: 'https://github.com/JulienEsbt/Megalis-Smart-Contract',
    },
    demos: {myWebsite: 'https://www.julienesterbet.com'},
} as const
