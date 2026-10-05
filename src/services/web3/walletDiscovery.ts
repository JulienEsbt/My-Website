import type {EthereumProvider} from '../../types/web3'

export interface DiscoveredWallet {
    id: string
    name: string
    icon?: string
    provider: EthereumProvider
    legacy?: boolean
}

// Discovery never requests accounts; only the explicit selection can open an extension.
export function discoverWallets(onChange: (wallets: DiscoveredWallet[]) => void): () => void {
    const announced: DiscoveredWallet[] = []
    const publish = () => {
        const fallback = window.ethereum
        const providers = fallback?.providers?.length
            ? fallback.providers
            : fallback
              ? [fallback]
              : []
        const legacy = providers
            .filter(
                (provider, index) =>
                    typeof provider?.request === 'function' &&
                    providers.indexOf(provider) === index &&
                    !announced.some((wallet) => wallet.provider === provider)
            )
            .map((provider, index) => ({
                id: `legacy-${index}`,
                name: '',
                provider,
                legacy: true,
            }))
        // A single global provider is ambiguous when several extensions are installed.
        onChange([...announced, ...(announced.length && !fallback?.providers ? [] : legacy)])
    }
    const announce = (event: Event) => {
        const detail = (event as CustomEvent).detail
        if (
            !detail ||
            typeof detail.provider?.request !== 'function' ||
            typeof detail.info?.uuid !== 'string' ||
            typeof detail.info?.name !== 'string'
        )
            return
        if (
            announced.some(
                (wallet) => wallet.id === detail.info.uuid || wallet.provider === detail.provider
            )
        )
            return
        announced.push({
            id: detail.info.uuid,
            name: detail.info.name.slice(0, 80),
            provider: detail.provider,
            ...(safeWalletIcon(detail.info.icon) ? {icon: detail.info.icon} : {}),
        })
        publish()
    }
    window.addEventListener('eip6963:announceProvider', announce)
    window.addEventListener('ethereum#initialized', publish)
    window.dispatchEvent(new Event('eip6963:requestProvider'))
    publish()
    return () => {
        window.removeEventListener('eip6963:announceProvider', announce)
        window.removeEventListener('ethereum#initialized', publish)
    }
}

export function safeWalletIcon(icon: unknown): string | undefined {
    return typeof icon === 'string' &&
        icon.length < 200_000 &&
        /^data:image\/(png|webp|jpeg|svg\+xml);/i.test(icon)
        ? icon
        : undefined
}

export function walletAccounts(value: unknown): string[] {
    if (!Array.isArray(value)) throw new Error('INVALID_ACCOUNT')
    if (value.some((address) => typeof address !== 'string' || !/^0x[\da-f]{40}$/i.test(address)))
        throw new Error('INVALID_ACCOUNT')
    return value.filter(
        (address, index) =>
            value.findIndex((other) => other.toLowerCase() === address.toLowerCase()) === index
    )
}

export async function requestWalletAccounts(provider: EthereumProvider): Promise<string[]> {
    const accounts = walletAccounts(await provider.request({method: 'eth_requestAccounts'}))
    if (!accounts.length) throw new Error('NO_ACCOUNTS')
    return accounts
}

export async function requestWalletAddress(provider: EthereumProvider): Promise<string> {
    const address = (await requestWalletAccounts(provider))[0]
    if (!address) throw new Error('NO_ACCOUNTS')
    return address
}

export function walletConnectionError(error: unknown): string {
    const value = error as {
        code?: number
        message?: string
        error?: {code?: number}
        info?: {error?: {code?: number}}
    }
    const code = value?.code ?? value?.error?.code ?? value?.info?.error?.code
    if (value?.message === 'NO_ACCOUNTS' || /at least one account/i.test(value?.message ?? ''))
        return 'noAccounts'
    if (value?.message === 'WALLETCONNECT_TIMEOUT') return 'connectionTimeout'
    if (value?.message === 'WALLETCONNECT_CONFIG') return 'connectionFailed'
    if (code === 5000) return 'rejected'
    if (code === 4001) return 'rejected'
    if (code === -32002) return 'pending'
    if (code === 4100) return 'unauthorized'
    return 'connectionFailed'
}
