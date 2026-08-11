import {BrowserProvider, JsonRpcProvider} from 'ethers'

const RPC_URLS = Object.freeze({
    VITE_ETH_RPC_URL: import.meta.env.VITE_ETH_RPC_URL,
    VITE_POLYGON_RPC_URL: import.meta.env.VITE_POLYGON_RPC_URL,
    VITE_ARBITRUM_RPC_URL: import.meta.env.VITE_ARBITRUM_RPC_URL,
    VITE_OPTIMISM_RPC_URL: import.meta.env.VITE_OPTIMISM_RPC_URL,
    VITE_BNB_RPC_URL: import.meta.env.VITE_BNB_RPC_URL,
})

export const getRpcUrl = (rpcEnv) => RPC_URLS[rpcEnv]

export const createReadOnlyProvider = (rpcUrl) => new JsonRpcProvider(rpcUrl)

export function getInjectedBrowserProvider() {
    if (!window.ethereum) throw new Error('NO_PROVIDER')
    return new BrowserProvider(window.ethereum)
}

export async function getConnectedWalletAddress() {
    const provider = getInjectedBrowserProvider()
    const signer = await provider.getSigner()
    return signer.getAddress()
}
