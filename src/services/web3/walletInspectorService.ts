import {formatEther, formatUnits, isAddress, type JsonRpcProvider} from 'ethers'
import {
    callAlchemy,
    fetchWalletNfts,
    type AlchemyTokenBalancesResult,
    type AlchemyTokenMetadata,
} from './alchemyService.js'
import {createReadOnlyProvider, getConnectedWalletAddress, getRpcUrl} from './rpcProviderService.js'
import {fetchWalletPrices} from './priceService.js'
import type {
    ValuedWalletToken,
    WalletIdentity,
    WalletNetwork,
    WalletToken,
    WalletValuationInput,
} from '../../types/web3'

const TOKEN_LIMIT = 120
const METADATA_CONCURRENCY = 4

async function mapWithConcurrency<T, R>(
    items: readonly T[],
    limit: number,
    mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results = new Array<R>(items.length)
    let nextIndex = 0
    const worker = async () => {
        while (nextIndex < items.length) {
            const index = nextIndex++
            const item = items[index]
            if (item !== undefined) results[index] = await mapper(item, index)
        }
    }
    await Promise.all(Array.from({length: Math.min(limit, items.length)}, worker))
    return results
}

async function resolveWalletInput({
    provider,
    input,
    network,
}: {
    provider: JsonRpcProvider
    input: string
    network: WalletNetwork
}): Promise<WalletIdentity | null> {
    const cleanInput = input.trim()
    const inputIsAddress: boolean = isAddress(cleanInput)
    if (inputIsAddress) {
        const ens =
            network.id === 'ethereum'
                ? await provider.lookupAddress(cleanInput).catch(() => null)
                : null
        const avatar = ens ? await provider.getAvatar(ens).catch(() => null) : null
        return {address: cleanInput, ens, avatar}
    }
    if (network.id !== 'ethereum' || !cleanInput.endsWith('.eth')) return null
    const address = await provider.resolveName(cleanInput).catch(() => null)
    if (!address) return null
    return {
        address,
        ens: cleanInput,
        avatar: await provider.getAvatar(cleanInput).catch(() => null),
    }
}

async function loadTokens({
    rpcUrl,
    walletAddress,
    signal,
}: {
    rpcUrl: string
    walletAddress: string
    signal?: AbortSignal
}) {
    const balances = await callAlchemy<AlchemyTokenBalancesResult>(
        rpcUrl,
        'alchemy_getTokenBalances',
        [walletAddress],
        signal
    )
    const detected = Array.isArray(balances?.tokenBalances)
        ? balances.tokenBalances.filter(
              (token) => token.tokenBalance && token.tokenBalance !== '0x0'
          )
        : []
    const rawTokens = detected.slice(0, TOKEN_LIMIT)
    let metadataFailures = 0

    const tokens = await mapWithConcurrency<
        AlchemyTokenBalancesResult['tokenBalances'][number],
        WalletToken | null
    >(rawTokens, METADATA_CONCURRENCY, async (token) => {
        try {
            const metadata = await callAlchemy<AlchemyTokenMetadata>(
                rpcUrl,
                'alchemy_getTokenMetadata',
                [token.contractAddress],
                signal
            )
            const balance = formatUnits(
                BigInt(token.tokenBalance ?? '0x0'),
                metadata.decimals ?? 18
            )
            const balanceNumber = Number(balance)
            if (!Number.isFinite(balanceNumber) || balanceNumber <= 0) return null
            return {
                contract: token.contractAddress,
                name: metadata.name || 'Unknown token',
                symbol: metadata.symbol || 'UNKNOWN',
                ...(metadata.logo ? {logo: metadata.logo} : {}),
                balance,
                balanceNumber,
            } satisfies WalletToken
        } catch (error) {
            if (signal?.aborted) throw error
            metadataFailures += 1
            return null
        }
    })

    return {
        tokens: tokens.filter((token): token is WalletToken => token !== null),
        detectedTokenCount: detected.length,
        truncated: detected.length > TOKEN_LIMIT,
        metadataFailures,
    }
}

export function valueWalletPortfolio({
    nativeBalance,
    network,
    tokens,
    nativePriceUsd,
    tokenPricesByContract,
}: WalletValuationInput) {
    const nativeValueUsd = nativeBalance * nativePriceUsd
    const valuedTokens: ValuedWalletToken[] = tokens
        .map((token) => {
            const priceUsd = tokenPricesByContract[token.contract.toLowerCase()] ?? 0
            return {
                ...token,
                id: `${network.id}-${token.contract.toLowerCase()}`,
                priceUsd,
                valueUsd: token.balanceNumber * priceUsd,
                allocation: 0,
            }
        })
        .sort((a, b) => b.valueUsd - a.valueUsd)
    const pricedTokens = valuedTokens.filter((token) => token.valueUsd > 0)
    const portfolioValueUsd =
        nativeValueUsd + pricedTokens.reduce((sum, token) => sum + token.valueUsd, 0)
    const allTokens = valuedTokens.map((token) => ({
        ...token,
        allocation:
            portfolioValueUsd > 0 && token.valueUsd > 0
                ? (token.valueUsd / portfolioValueUsd) * 100
                : 0,
    }))
    const holdings = [
        {
            id: `native-${network.id}`,
            symbol: network.symbol,
            valueUsd: nativeValueUsd,
            allocation: portfolioValueUsd > 0 ? (nativeValueUsd / portfolioValueUsd) * 100 : 0,
        },
        ...pricedTokens.map((token) => ({
            id: token.id,
            symbol: token.symbol,
            valueUsd: token.valueUsd,
            allocation: portfolioValueUsd > 0 ? (token.valueUsd / portfolioValueUsd) * 100 : 0,
        })),
    ].sort((a, b) => b.valueUsd - a.valueUsd)
    const allocationItems = [
        holdings.find((item) => item.id === `native-${network.id}`),
        ...allTokens,
    ]
        .filter((item): item is NonNullable<typeof item> =>
            Boolean(item?.valueUsd && item.valueUsd > 0)
        )
        .slice(0, 5)

    return {
        nativeValueUsd,
        portfolioValueUsd,
        pricedTokenCount: pricedTokens.length,
        topHolding: holdings[0],
        topTokens: allTokens.slice(0, 5),
        allTokens,
        allocationItems,
    }
}

export async function inspectWalletPortfolio({
    walletInput,
    network,
    signal,
}: {
    walletInput: string
    network: WalletNetwork
    signal?: AbortSignal
}) {
    const rpcUrl = getRpcUrl(network.rpcEnv)
    if (!rpcUrl) throw new Error('MISSING_RPC')
    const provider = createReadOnlyProvider(rpcUrl)
    const wallet = await resolveWalletInput({provider, input: walletInput, network})
    if (!wallet) throw new Error('INVALID_ADDRESS')

    const [nativeBalanceRaw, tokenResult, nfts] = await Promise.all([
        provider.getBalance(wallet.address),
        loadTokens({rpcUrl, walletAddress: wallet.address, ...(signal ? {signal} : {})}),
        fetchWalletNfts(rpcUrl, wallet.address, signal),
    ])
    const nativeBalance = Number(formatEther(nativeBalanceRaw))
    const prices = await fetchWalletPrices({
        networkId: network.id,
        tokenContracts: tokenResult.tokens.map((token) => token.contract),
        ...(signal ? {signal} : {}),
    })
    const valuation = valueWalletPortfolio({
        nativeBalance,
        network,
        tokens: tokenResult.tokens,
        ...prices,
    })

    return {
        ...wallet,
        network,
        nativeBalance,
        tokenCount: tokenResult.detectedTokenCount,
        loadedTokenCount: tokenResult.tokens.length,
        tokenDataTruncated: tokenResult.truncated,
        tokenMetadataFailures: tokenResult.metadataFailures,
        valuationPartial: prices.partial,
        nftCount: nfts.length,
        nfts,
        ...valuation,
    }
}

export const connectInjectedWallet = (): Promise<string> => getConnectedWalletAddress()
