import type {BlockchainNetwork} from './domain'

export type NetworkId = BlockchainNetwork['id']
export type RpcEnvironmentName = BlockchainNetwork['rpcEnv']

export interface BlockchainStatus {
    id: NetworkId
    status: 'online' | 'error' | 'missing-rpc'
    chainId?: string
    blockNumber?: number
    gasPrice?: number | null
    maxFee?: number | null
    priorityFee?: number | null
}

export interface AlchemyTokenBalance {
    contractAddress: string
    tokenBalance: string | null
}

export interface AlchemyTokenBalancesResult {
    tokenBalances: AlchemyTokenBalance[]
}

export interface AlchemyTokenMetadata {
    decimals?: number
    logo?: string
    name?: string
    symbol?: string
}

export interface WalletNft {
    id: string
    name: string
    collection: string
    image: string
    contract?: string
    tokenId?: string
}

export interface WalletPriceResult {
    nativePriceUsd: number
    tokenPricesByContract: Record<string, number>
    partial: boolean
}

export interface WalletToken {
    contract: string
    name?: string
    symbol: string
    logo?: string
    balance: string
    balanceNumber: number
}

export interface ValuedWalletToken extends WalletToken {
    id: string
    priceUsd: number
    valueUsd: number
    allocation: number
}

export interface WalletNetwork {
    id: NetworkId
    name: string
    symbol: string
    rpcEnv: RpcEnvironmentName
    explorer: string
}

export interface WalletIdentity {
    address: string
    ens: string | null
    avatar: string | null
}

export interface WalletTransfer {
    id: string
    hash: string
    direction: 'in' | 'out'
    counterparty: string
    asset: string
    value: number | null
    category: string
    timestamp: string | null
}

export interface WalletNetworkSnapshot {
    network: WalletNetwork
    status: 'available' | 'missing-rpc' | 'error'
    nativeBalance?: number
    nativeValueUsd?: number
}

export interface WalletValuationInput {
    nativeBalance: number
    network: Pick<WalletNetwork, 'id' | 'symbol'>
    tokens: readonly WalletToken[]
    nativePriceUsd: number
    tokenPricesByContract: Readonly<Record<string, number>>
}

export interface DonationToken {
    id: string
    chainId: bigint
    chainHex: `0x${string}`
    networkName: string
    symbol: string
    name?: string
    type: 'native' | 'erc20'
    decimals: number
    contract?: string
    explorer: string
    logoURI?: string
    catalog?: boolean
    custom?: boolean
}

export interface EthereumProvider {
    request(args: {method: string; params?: readonly unknown[]}): Promise<unknown>
}

declare global {
    interface Window {
        ethereum?: EthereumProvider
    }
}
