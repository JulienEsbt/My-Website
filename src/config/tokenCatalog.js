import defaultTokenList from '@uniswap/default-token-list'

export const CHAIN_METADATA = {
    1: {
        name: 'Ethereum',
        chainHex: '0x1',
        explorer: 'https://etherscan.io/',
    },
    10: {
        name: 'Optimism',
        chainHex: '0xa',
        explorer: 'https://optimistic.etherscan.io/',
    },
    56: {
        name: 'BNB Chain',
        chainHex: '0x38',
        explorer: 'https://bscscan.com/',
    },
    137: {
        name: 'Polygon',
        chainHex: '0x89',
        explorer: 'https://polygonscan.com/',
    },
    42161: {
        name: 'Arbitrum',
        chainHex: '0xa4b1',
        explorer: 'https://arbiscan.io/',
    },
    8453: {
        name: 'Base',
        chainHex: '0x2105',
        explorer: 'https://basescan.org/',
    },
}

export const TOKEN_CATALOG = defaultTokenList.tokens
    .filter((token) => CHAIN_METADATA[token.chainId])
    .map((token) => {
        const chain = CHAIN_METADATA[token.chainId]

        return {
            id: `catalog-${token.chainId}-${token.address.toLowerCase()}`,
            chainId: BigInt(token.chainId),
            chainHex: chain.chainHex,
            networkName: chain.name,
            symbol: token.symbol,
            name: token.name,
            type: 'erc20',
            decimals: token.decimals,
            contract: token.address,
            explorer: chain.explorer,
            logoURI: token.logoURI,
            catalog: true,
        }
    })
