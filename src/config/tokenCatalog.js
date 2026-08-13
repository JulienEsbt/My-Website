import defaultTokenList from '@uniswap/default-token-list'
import {CHAIN_METADATA} from './evmChains.js'

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
