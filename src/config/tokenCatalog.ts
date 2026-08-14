import defaultTokenList from '@uniswap/default-token-list'
import {CHAIN_METADATA} from './evmChains.js'
import type {DonationToken} from '../types/web3'

export const TOKEN_CATALOG: readonly DonationToken[] = defaultTokenList.tokens.flatMap((token) => {
    const chain = CHAIN_METADATA[token.chainId as keyof typeof CHAIN_METADATA]
    if (!chain) return []
    return [
        {
            id: `catalog-${token.chainId}-${token.address.toLowerCase()}`,
            chainId: BigInt(token.chainId),
            chainHex: chain.chainHex,
            networkName: chain.name,
            symbol: token.symbol,
            name: token.name,
            type: 'erc20' as const,
            decimals: token.decimals,
            contract: token.address,
            explorer: chain.explorer,
            ...(token.logoURI ? {logoURI: token.logoURI} : {}),
            catalog: true,
        },
    ]
})
