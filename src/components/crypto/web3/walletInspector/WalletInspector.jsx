import React, {useMemo, useState} from 'react'
import {BrowserProvider, JsonRpcProvider, formatEther, formatUnits, isAddress} from 'ethers'
import {motion} from 'framer-motion'
import {FiExternalLink, FiSearch, FiX} from 'react-icons/fi'
import {TbWallet} from 'react-icons/tb'
import {useTranslation} from 'react-i18next'
import {BLOCKCHAIN_NETWORKS} from '../../../../config/blockchains.js'
import './WalletInspector.css'

const RPC_URLS = {
    VITE_ETH_RPC_URL: import.meta.env.VITE_ETH_RPC_URL,
    VITE_POLYGON_RPC_URL: import.meta.env.VITE_POLYGON_RPC_URL,
    VITE_ARBITRUM_RPC_URL: import.meta.env.VITE_ARBITRUM_RPC_URL,
    VITE_OPTIMISM_RPC_URL: import.meta.env.VITE_OPTIMISM_RPC_URL,
    VITE_BNB_RPC_URL: import.meta.env.VITE_BNB_RPC_URL,
}

const COINGECKO_IDS = {
    ETH: 'ethereum',
    WETH: 'ethereum',
    BTC: 'bitcoin',
    WBTC: 'wrapped-bitcoin',
    USDC: 'usd-coin',
    USDT: 'tether',
    DAI: 'dai',
    LINK: 'chainlink',
    AAVE: 'aave',
    UNI: 'uniswap',
    ARB: 'arbitrum',
    OP: 'optimism',
    BNB: 'binancecoin',
    MATIC: 'matic-network',
    POL: 'polygon-ecosystem-token',
}

const getRpcUrl = (rpcEnv) => RPC_URLS[rpcEnv]

const shortenAddress = (value) => {
    if (!value) return ''
    return `${value.slice(0, 6)}...${value.slice(-4)}`
}

const formatUsd = (value) =>
    `$${Number(value || 0).toLocaleString(undefined, {
        maximumFractionDigits: value >= 100 ? 0 : 2,
    })}`

const callAlchemy = async (rpcUrl, method, params) => {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params,
        }),
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    return data.result
}

const fetchCoinGeckoPrices = async (symbols) => {
    const ids = [
        ...new Set(
            symbols
                .map((symbol) => COINGECKO_IDS[symbol?.toUpperCase()])
                .filter(Boolean)
        ),
    ]

    if (!ids.length) return {}

    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`
    )

    if (!response.ok) return {}

    return response.json()
}

const getAlchemyNftUrl = (rpcUrl, owner) => {
    const apiKey = rpcUrl.split('/v2/')[1]
    const network = rpcUrl.split('https://')[1].split('.g.alchemy.com')[0]

    return `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${owner}&withMetadata=true&pageSize=12`
}

const fetchNfts = async (rpcUrl, owner) => {
    try {
        const response = await fetch(getAlchemyNftUrl(rpcUrl, owner))
        if (!response.ok) return []

        const data = await response.json()

        return (data.ownedNfts ?? [])
            .map((nft) => ({
                id: `${nft.contract?.address}-${nft.tokenId}`,
                name: nft.name || nft.title || 'NFT',
                collection: nft.collection?.name || nft.contract?.name || 'Unknown collection',
                image:
                    nft.image?.cachedUrl ||
                    nft.image?.pngUrl ||
                    nft.image?.thumbnailUrl ||
                    nft.raw?.metadata?.image ||
                    '',
                contract: nft.contract?.address,
                tokenId: nft.tokenId,
            }))
            .filter((nft) => nft.image)
    } catch {
        return []
    }
}

const WalletInspector = () => {
    const {t} = useTranslation('crypto')

    const [address, setAddress] = useState('')
    const [selectedNetworkId, setSelectedNetworkId] = useState('ethereum')
    const [result, setResult] = useState(null)
    const [selectedNft, setSelectedNft] = useState(null)
    const [showAllTokens, setShowAllTokens] = useState(false)
    const [showAllNfts, setShowAllNfts] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const selectedNetwork = useMemo(
        () => BLOCKCHAIN_NETWORKS.find((network) => network.id === selectedNetworkId),
        [selectedNetworkId]
    )

    const resolveWalletInput = async (provider, input) => {
        const cleanInput = input.trim()

        if (isAddress(cleanInput)) {
            const ens =
                selectedNetwork.id === 'ethereum'
                    ? await provider.lookupAddress(cleanInput).catch(() => null)
                    : null

            const avatar =
                ens && selectedNetwork.id === 'ethereum'
                    ? await provider.getAvatar(ens).catch(() => null)
                    : null

            return {address: cleanInput, ens, avatar}
        }

        if (selectedNetwork.id !== 'ethereum' || !cleanInput.endsWith('.eth')) {
            return null
        }

        const resolvedAddress = await provider.resolveName(cleanInput).catch(() => null)
        if (!resolvedAddress) return null

        const avatar = await provider.getAvatar(cleanInput).catch(() => null)

        return {
            address: resolvedAddress,
            ens: cleanInput,
            avatar,
        }
    }

    const inspectAddress = async (walletInput) => {
        const rpcUrl = getRpcUrl(selectedNetwork.rpcEnv)

        if (!rpcUrl) {
            setError(t('walletInspector.errors.missingRpc'))
            return
        }

        try {
            setLoading(true)
            setError('')
            setResult(null)

            const provider = new JsonRpcProvider(rpcUrl)
            const resolvedWallet = await resolveWalletInput(provider, walletInput)

            if (!resolvedWallet) {
                setError(t('walletInspector.errors.invalidAddress'))
                return
            }

            const [nativeBalanceRaw, tokenBalances, nfts] = await Promise.all([
                provider.getBalance(resolvedWallet.address),
                callAlchemy(rpcUrl, 'alchemy_getTokenBalances', [resolvedWallet.address]),
                fetchNfts(rpcUrl, resolvedWallet.address),
            ])

            const nativeBalance = Number(formatEther(nativeBalanceRaw))

            const rawTokens = tokenBalances.tokenBalances
                .filter((token) => token.tokenBalance && token.tokenBalance !== '0x0')
                .slice(0, 120)

            const tokens = await Promise.all(
                rawTokens.map(async (token) => {
                    try {
                        const metadata = await callAlchemy(
                            rpcUrl,
                            'alchemy_getTokenMetadata',
                            [token.contractAddress]
                        )

                        const rawBalance = BigInt(token.tokenBalance)
                        const decimals = metadata.decimals ?? 18
                        const balance = formatUnits(rawBalance, decimals)
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

            const nonZeroTokens = tokens.filter(Boolean)

            const prices = await fetchCoinGeckoPrices([
                selectedNetwork.symbol,
                ...nonZeroTokens.map((token) => token.symbol),
            ])

            const getPriceUsd = (symbol) => {
                const coinId = COINGECKO_IDS[symbol?.toUpperCase()]
                return coinId && prices[coinId]?.usd ? prices[coinId].usd : 0
            }

            const nativePriceUsd = getPriceUsd(selectedNetwork.symbol)
            const nativeValueUsd = nativeBalance * nativePriceUsd

            const valuedTokens = nonZeroTokens
                .map((token) => {
                    const priceUsd = getPriceUsd(token.symbol)
                    const valueUsd = token.balanceNumber * priceUsd

                    return {
                        ...token,
                        priceUsd,
                        valueUsd,
                    }
                })
                .sort((a, b) => b.valueUsd - a.valueUsd)

            const pricedTokens = valuedTokens.filter((token) => token.valueUsd > 0)
            const unpricedTokens = valuedTokens.filter((token) => token.valueUsd === 0)

            const portfolioValueUsd =
                nativeValueUsd +
                pricedTokens.reduce((sum, token) => sum + token.valueUsd, 0)

            const allTokens = [...pricedTokens, ...unpricedTokens].map((token) => ({
                ...token,
                allocation:
                    portfolioValueUsd > 0 && token.valueUsd > 0
                        ? (token.valueUsd / portfolioValueUsd) * 100
                        : 0,
            }))

            const topTokens = allTokens.slice(0, 5)

            const topHolding = [
                {
                    symbol: selectedNetwork.symbol,
                    valueUsd: nativeValueUsd,
                    allocation:
                        portfolioValueUsd > 0
                            ? (nativeValueUsd / portfolioValueUsd) * 100
                            : 0,
                },
                ...pricedTokens.map((token) => ({
                    symbol: token.symbol,
                    valueUsd: token.valueUsd,
                    allocation:
                        portfolioValueUsd > 0
                            ? (token.valueUsd / portfolioValueUsd) * 100
                            : 0,
                })),
            ].sort((a, b) => b.valueUsd - a.valueUsd)[0]

            const allocationItems = [
                {
                    symbol: selectedNetwork.symbol,
                    valueUsd: nativeValueUsd,
                    allocation:
                        portfolioValueUsd > 0
                            ? (nativeValueUsd / portfolioValueUsd) * 100
                            : 0,
                },
                ...allTokens.filter((token) => token.valueUsd > 0),
            ]
                .filter((item) => item.valueUsd > 0)
                .slice(0, 5)

            setResult({
                address: resolvedWallet.address,
                ens: resolvedWallet.ens,
                avatar: resolvedWallet.avatar,
                network: selectedNetwork,
                nativeBalance,
                nativeValueUsd,
                portfolioValueUsd,
                tokenCount: nonZeroTokens.length,
                pricedTokenCount: pricedTokens.length,
                nftCount: nfts.length,
                topHolding,
                topTokens,
                allTokens,
                allocationItems,
                nfts,
            })
        } catch (err) {
            console.error(err)
            setError(t('walletInspector.errors.failed'))
        } finally {
            setLoading(false)
        }
    }

    const inspectWallet = async (event) => {
        event.preventDefault()
        await inspectAddress(address)
    }

    const connectCurrentWallet = async () => {
        if (!window.ethereum) {
            setError(t('walletInspector.errors.noProvider'))
            return
        }

        try {
            const browserProvider = new BrowserProvider(window.ethereum)
            const signer = await browserProvider.getSigner()
            const connectedAddress = await signer.getAddress()

            setAddress(connectedAddress)
            await inspectAddress(connectedAddress)
        } catch (err) {
            console.error(err)
            setError(t('walletInspector.errors.failed'))
        }
    }

    const renderTokenRow = (token) => (
        <article key={token.contract} className="wallet-token-row">
            {token.logo ? (
                <img src={token.logo} alt=""/>
            ) : (
                <div className="wallet-token-fallback">
                    {token.symbol.slice(0, 1)}
                </div>
            )}

            <div>
                <strong>{token.symbol}</strong>
                <span>{token.name}</span>
            </div>

            <div>
                <strong>
                    {token.valueUsd > 0
                        ? formatUsd(token.valueUsd)
                        : t('walletInspector.unpriced')}
                </strong>
                <span>
                    {Number(token.balance).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                    })}
                </span>
            </div>

            <em>
                {token.valueUsd > 0 ? `${token.allocation.toFixed(1)}%` : '-'}
            </em>
        </article>
    )

    return (
        <section id="wallet-inspector">
            <h5>{t('walletInspector.kicker')}</h5>
            <h2>{t('walletInspector.title')}</h2>

            <motion.article
                className="container wallet-inspector"
                initial={{opacity: 0, y: 35}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.55}}
            >
                <form className="wallet-inspector__searchbar" onSubmit={inspectWallet}>
                    <select
                        value={selectedNetworkId}
                        onChange={(event) => setSelectedNetworkId(event.target.value)}
                    >
                        {BLOCKCHAIN_NETWORKS.map((network) => (
                            <option key={network.id} value={network.id}>
                                {network.name}
                            </option>
                        ))}
                    </select>

                    <input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder={t('walletInspector.placeholder')}
                    />

                    {result?.ens && (
                        <span className="wallet-inspector__ens-valid">✓ ENS</span>
                    )}

                    <button className="btn btn-primary" disabled={loading}>
                        <FiSearch/>
                        {loading ? t('walletInspector.loading') : t('walletInspector.inspect')}
                    </button>

                    <button
                        type="button"
                        className="btn wallet-inspector__connect"
                        onClick={connectCurrentWallet}
                        disabled={loading}
                    >
                        <TbWallet/>
                        {t('walletInspector.connect')}
                    </button>
                </form>

                {error && <p className="wallet-inspector__error">{error}</p>}

                {result && (
                    <>
                        <div className="wallet-inspector__overview">
                            <div className="wallet-inspector__identity-card">
                                {result.avatar ? (
                                    <img src={result.avatar} alt=""/>
                                ) : (
                                    <div className="wallet-inspector__avatar-fallback">
                                        {(result.ens || result.address).slice(0, 2).toUpperCase()}
                                    </div>
                                )}

                                <div>
                                    <strong>{result.ens || shortenAddress(result.address)}</strong>
                                    <span>{shortenAddress(result.address)}</span>
                                    <small>{result.network.name}</small>
                                </div>
                            </div>

                            <div className="wallet-inspector__metric">
                                <span>{t('walletInspector.portfolio')}</span>
                                <strong>{formatUsd(result.portfolioValueUsd)}</strong>
                            </div>

                            <div className="wallet-inspector__metric">
                                <span>{t('walletInspector.nativeBalance')}</span>
                                <strong>
                                    {result.nativeBalance.toFixed(5)} {result.network.symbol}
                                </strong>
                                <small>{formatUsd(result.nativeValueUsd)}</small>
                            </div>

                            <div className="wallet-inspector__metric">
                                <span>{t('walletInspector.tokenCount')}</span>
                                <strong>{result.tokenCount}</strong>
                                <small>
                                    {result.pricedTokenCount} {t('walletInspector.pricedTokens')}
                                </small>
                            </div>

                            <div className="wallet-inspector__metric">
                                <span>{t('walletInspector.nfts')}</span>
                                <strong>{result.nftCount}</strong>
                            </div>

                            <div className="wallet-inspector__metric">
                                <span>{t('walletInspector.topHolding')}</span>
                                <strong>{result.topHolding?.symbol ?? '-'}</strong>
                                <small>
                                    {result.topHolding?.allocation
                                        ? `${result.topHolding.allocation.toFixed(1)}%`
                                        : formatUsd(result.topHolding?.valueUsd ?? 0)}
                                </small>
                            </div>

                            <a
                                href={`${result.network.explorer}/address/${result.address}`}
                                target="_blank"
                                rel="noreferrer"
                                className="wallet-inspector__explorer"
                            >
                                {t('walletInspector.openExplorer')} <FiExternalLink/>
                            </a>
                        </div>

                        <div className="wallet-inspector__main-grid">
                            <article className="wallet-inspector__panel wallet-inspector__allocation">
                                <div className="wallet-inspector__panel-head">
                                    <h3>{t('walletInspector.allocation')}</h3>
                                    <span>{formatUsd(result.portfolioValueUsd)}</span>
                                </div>

                                {result.allocationItems.length === 0 ? (
                                    <p>{t('walletInspector.noPricedAssets')}</p>
                                ) : (
                                    <div className="allocation-donut-layout">
                                        <div
                                            className="allocation-donut"
                                            style={{
                                                background: `conic-gradient(
                                                    #4db5ff 0 ${result.allocationItems[0]?.allocation ?? 0}%,
                                                    #7cffb2 ${result.allocationItems[0]?.allocation ?? 0}% ${
                                                    (result.allocationItems[0]?.allocation ?? 0) +
                                                    (result.allocationItems[1]?.allocation ?? 0)
                                                }%,
                                                    #7c5cff ${
                                                    (result.allocationItems[0]?.allocation ?? 0) +
                                                    (result.allocationItems[1]?.allocation ?? 0)
                                                }% ${
                                                    (result.allocationItems[0]?.allocation ?? 0) +
                                                    (result.allocationItems[1]?.allocation ?? 0) +
                                                    (result.allocationItems[2]?.allocation ?? 0)
                                                }%,
                                                    #ffb86b ${
                                                    (result.allocationItems[0]?.allocation ?? 0) +
                                                    (result.allocationItems[1]?.allocation ?? 0) +
                                                    (result.allocationItems[2]?.allocation ?? 0)
                                                }% 100%
                                                )`,
                                            }}
                                        >
                                            <div>
                                                <strong>{formatUsd(result.portfolioValueUsd)}</strong>
                                                <span>Total</span>
                                            </div>
                                        </div>

                                        <div className="allocation-legend">
                                            {result.allocationItems.map((item, index) => (
                                                <div key={item.symbol} className="allocation-legend-row">
                                                    <i className={`allocation-color color-${index}`}/>
                                                    <strong>{item.symbol}</strong>
                                                    <span>{item.allocation.toFixed(1)}%</span>
                                                    <em>{formatUsd(item.valueUsd)}</em>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </article>

                            <article className="wallet-inspector__panel wallet-inspector__tokens-panel">
                                <div className="wallet-inspector__panel-head">
                                    <h3>{t('walletInspector.tokens')}</h3>

                                    <button
                                        type="button"
                                        className="wallet-inspector__view-all"
                                        onClick={() => setShowAllTokens(true)}
                                    >
                                        {t('walletInspector.viewAll')} · {result.tokenCount}
                                    </button>
                                </div>

                                {result.topTokens.length === 0 ? (
                                    <p>{t('walletInspector.noTokens')}</p>
                                ) : (
                                    <div className="wallet-token-list">
                                        {result.topTokens.map(renderTokenRow)}
                                    </div>
                                )}
                            </article>

                            <article className="wallet-inspector__panel wallet-inspector__nfts-panel">
                                <div className="wallet-inspector__panel-head">
                                    <h3>{t('walletInspector.nfts')}</h3>

                                    <button
                                        type="button"
                                        className="wallet-inspector__view-all"
                                        onClick={() => setShowAllNfts(true)}
                                    >
                                        {t('walletInspector.viewAll')} · {result.nftCount}
                                    </button>
                                </div>

                                {result.nfts.length === 0 ? (
                                    <p>{t('walletInspector.noNfts')}</p>
                                ) : (
                                    <div className="wallet-nft-strip">
                                        {result.nfts.slice(0, 4).map((nft) => (
                                            <button
                                                key={nft.id}
                                                type="button"
                                                className="wallet-nft-card"
                                                onClick={() => setSelectedNft(nft)}
                                            >
                                                <img src={nft.image} alt={nft.name}/>
                                                <strong>{nft.name}</strong>
                                                <span>{nft.collection}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </article>
                        </div>
                    </>
                )}

                {showAllTokens && result && (
                    <div className="wallet-inspector__modal" onClick={() => setShowAllTokens(false)}>
                        <div
                            className="wallet-inspector__modal-content wallet-inspector__modal-content--wide"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="wallet-inspector__modal-close"
                                onClick={() => setShowAllTokens(false)}
                            >
                                <FiX/>
                            </button>

                            <h3>{t('walletInspector.tokens')}</h3>

                            <div className="wallet-token-list wallet-token-list--modal">
                                {result.allTokens.map(renderTokenRow)}
                            </div>
                        </div>
                    </div>
                )}

                {showAllNfts && result && (
                    <div className="wallet-inspector__modal" onClick={() => setShowAllNfts(false)}>
                        <div
                            className="wallet-inspector__modal-content wallet-inspector__modal-content--wide"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="wallet-inspector__modal-close"
                                onClick={() => setShowAllNfts(false)}
                            >
                                <FiX/>
                            </button>

                            <h3>{t('walletInspector.nfts')}</h3>

                            <div className="wallet-nft-gallery">
                                {result.nfts.map((nft) => (
                                    <button
                                        key={nft.id}
                                        type="button"
                                        className="wallet-nft-card"
                                        onClick={() => {
                                            setShowAllNfts(false)
                                            setSelectedNft(nft)
                                        }}
                                    >
                                        <img src={nft.image} alt={nft.name}/>
                                        <strong>{nft.name}</strong>
                                        <span>{nft.collection}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedNft && (
                    <div
                        className="wallet-inspector__modal"
                        onClick={() => setSelectedNft(null)}
                    >
                        <div
                            className="wallet-inspector__modal-content wallet-inspector__modal-content--single"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="wallet-inspector__modal-close"
                                onClick={() => setSelectedNft(null)}
                            >
                                <FiX/>
                            </button>

                            <img src={selectedNft.image} alt={selectedNft.name}/>
                            <h3>{selectedNft.name}</h3>
                            <p>{selectedNft.collection}</p>
                        </div>
                    </div>
                )}
            </motion.article>
        </section>
    )
}

export default WalletInspector