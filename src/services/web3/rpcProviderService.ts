import {BrowserProvider, JsonRpcProvider} from 'ethers'
import type {RpcEnvironmentName} from '../../types/web3'

const RPC_URLS: Readonly<Record<RpcEnvironmentName, string | undefined>> = Object.freeze({
    VITE_ETH_RPC_URL: import.meta.env.VITE_ETH_RPC_URL,
    VITE_POLYGON_RPC_URL: import.meta.env.VITE_POLYGON_RPC_URL,
    VITE_ARBITRUM_RPC_URL: import.meta.env.VITE_ARBITRUM_RPC_URL,
    VITE_OPTIMISM_RPC_URL: import.meta.env.VITE_OPTIMISM_RPC_URL,
    VITE_BNB_RPC_URL: import.meta.env.VITE_BNB_RPC_URL,
})

export const getRpcUrl = (rpcEnv: RpcEnvironmentName): string | undefined => RPC_URLS[rpcEnv]

export const createReadOnlyProvider = (rpcUrl: string): JsonRpcProvider =>
    new JsonRpcProvider(rpcUrl)

export function getInjectedBrowserProvider(): BrowserProvider {
    if (!window.ethereum) throw new Error('NO_PROVIDER')
    return new BrowserProvider(window.ethereum)
}

export async function getConnectedWalletAddress(): Promise<string> {
    const provider = getInjectedBrowserProvider()
    const signer = await provider.getSigner()
    return signer.getAddress()
}
