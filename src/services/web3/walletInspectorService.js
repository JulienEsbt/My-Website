import {formatEther, formatUnits, isAddress} from 'ethers'
import {callAlchemy, fetchWalletNfts} from './alchemyService.js'
import {createReadOnlyProvider, getConnectedWalletAddress, getRpcUrl} from './rpcProviderService.js'
import {fetchIndicativePrices, getIndicativeUsdPrice} from './priceService.js'

const resolveWalletInput = async ({provider, input, network}) => {
    const cleanInput = input.trim()

    if (isAddress(cleanInput)) {
        const ens =
            network.id === 'ethereum'
                ? await provider.lookupAddress(cleanInput).catch(() => null)
                : null
        const avatar =
            ens && network.id === 'ethereum'
                ? await provider.getAvatar(ens).catch(() => null)
                : null

        return {address: cleanInput, ens, avatar}
    }

    if (network.id !== 'ethereum' || !cleanInput.endsWith('.eth')) return null

    const resolvedAddress = await provider.resolveName(cleanInput).catch(() => null)
    if (!resolvedAddress) return null

    return {
        address: resolvedAddress,
        ens: cleanInput,
        avatar: await provider.getAvatar(cleanInput).catch(() => null),
    }
}

const loadTokens = async ({rpcUrl, walletAddress, signal}) => {
    const tokenBalances = await callAlchemy(
        rpcUrl,
        'alchemy_getTokenBalances',
        [walletAddress],
        signal
    )
    const rawTokens = tokenBalances.tokenBalances
        .filter((token) => token.tokenBalance && token.tokenBalance !== '0x0')
        .slice(0, 120)

    const tokens = await Promise.all(
        rawTokens.map(async (token) => {
            try {
                const metadata = await callAlchemy(
                    rpcUrl,
                    'alchemy_getTokenMetadata',
                    [token.contractAddress],
                    signal
                )
                const balance = formatUnits(BigInt(token.tokenBalance), metadata.decimals ?? 18)
                const balanceNumber = Number(balance)

                if (!balanceNumber || balanceNumber <= 0) return null

                return {
                    contract: token.contractAddress,
                    name: metadata.name || 'Unknown token',
                    symbol: metadata.symbol || 'UNKNOWN',
                    logo: metadata.logo,
                    balance,
                    balanceNumber,
                }
            } catch {
                return null
            }
        })
    )

    return tokens.filter(Boolean)
}

export const valueWalletPortfolio = ({nativeBalance, network, tokens, prices}) => {
    const nativePriceUsd = getIndicativeUsdPrice(prices, network.symbol)
    const nativeValueUsd = nativeBalance * nativePriceUsd
    const valuedTokens = tokens
        .map((token) => {
            const priceUsd = getIndicativeUsdPrice(prices, token.symbol)
            return {...token, priceUsd, valueUsd: token.balanceNumber * priceUsd}
        })
        .sort((a, b) => b.valueUsd - a.valueUsd)
    const pricedTokens = valuedTokens.filter((token) => token.valueUsd > 0)
    const unpricedTokens = valuedTokens.filter((token) => token.valueUsd === 0)
    const portfolioValueUsd =
        nativeValueUsd + pricedTokens.reduce((sum, token) => sum + token.valueUsd, 0)
    const allTokens = [...pricedTokens, ...unpricedTokens].map((token) => ({
        ...token,
        allocation:
            portfolioValueUsd > 0 && token.valueUsd > 0
                ? (token.valueUsd / portfolioValueUsd) * 100
                : 0,
    }))
    const holdings = [
        {
            symbol: network.symbol,
            valueUsd: nativeValueUsd,
            allocation: portfolioValueUsd > 0 ? (nativeValueUsd / portfolioValueUsd) * 100 : 0,
        },
        ...pricedTokens.map((token) => ({
            symbol: token.symbol,
            valueUsd: token.valueUsd,
            allocation: portfolioValueUsd > 0 ? (token.valueUsd / portfolioValueUsd) * 100 : 0,
        })),
    ].sort((a, b) => b.valueUsd - a.valueUsd)
    const allocationItems = [
        holdings.find((item) => item.symbol === network.symbol),
        ...allTokens.filter((token) => token.valueUsd > 0),
    ]
        .filter((item) => item?.valueUsd > 0)
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

export const inspectWalletPortfolio = async ({walletInput, network, signal}) => {
    const rpcUrl = getRpcUrl(network.rpcEnv)
    if (!rpcUrl) throw new Error('MISSING_RPC')

    const provider = createReadOnlyProvider(rpcUrl)
    const wallet = await resolveWalletInput({provider, input: walletInput, network})
    if (!wallet) throw new Error('INVALID_ADDRESS')

    const [nativeBalanceRaw, tokens, nfts] = await Promise.all([
        provider.getBalance(wallet.address),
        loadTokens({rpcUrl, walletAddress: wallet.address, signal}),
        fetchWalletNfts(rpcUrl, wallet.address, signal),
    ])
    const nativeBalance = Number(formatEther(nativeBalanceRaw))
    const prices = await fetchIndicativePrices(
        [network.symbol, ...tokens.map((token) => token.symbol)],
        signal
    )
    const valuation = valueWalletPortfolio({nativeBalance, network, tokens, prices})

    return {
        ...wallet,
        network,
        nativeBalance,
        tokenCount: tokens.length,
        nftCount: nfts.length,
        nfts,
        ...valuation,
    }
}

export const connectInjectedWallet = () => getConnectedWalletAddress()
