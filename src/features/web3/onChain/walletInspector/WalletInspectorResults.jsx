import {FiExternalLink} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import WalletTokenRow from './WalletTokenRow.jsx'
import {formatUsd, shortenAddress} from './walletFormatters.js'
import {formatNumber, formatPercent} from '../../../../i18n/formatters.js'

const ALLOCATION_COLORS = ['#4db5ff', '#7cffb2', '#7c5cff', '#ffb86b', '#ff6b9d']

const getAllocationGradient = (items) => {
    let start = 0
    const segments = items.map((item, index) => {
        const end = Math.min(100, start + item.allocation)
        const segment = `${ALLOCATION_COLORS[index]} ${start}% ${end}%`
        start = end
        return segment
    })

    if (start < 100) segments.push(`rgba(255, 255, 255, 0.08) ${start}% 100%`)
    return `conic-gradient(${segments.join(', ')})`
}

const WalletInspectorResults = ({result, onSelectNft, onShowAllNfts, onShowAllTokens}) => {
    const {t, i18n} = useTranslation('web3')
    const language = i18n.resolvedLanguage ?? i18n.language

    return (
        <>
            <div className="wallet-inspector__overview">
                <div className="wallet-inspector__identity-card">
                    {result.avatar ? (
                        <img src={result.avatar} alt="" />
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
                    <strong>{formatUsd(result.portfolioValueUsd, language)}</strong>
                </div>

                <div className="wallet-inspector__metric">
                    <span>{t('walletInspector.nativeBalance')}</span>
                    <strong>
                        {formatNumber(result.nativeBalance, language, {maximumFractionDigits: 5})}{' '}
                        {result.network.symbol}
                    </strong>
                    <small>{formatUsd(result.nativeValueUsd, language)}</small>
                </div>

                <div className="wallet-inspector__metric">
                    <span>{t('walletInspector.tokenCount')}</span>
                    <strong>{formatNumber(result.tokenCount, language)}</strong>
                    <small>
                        {formatNumber(result.pricedTokenCount, language)}{' '}
                        {t('walletInspector.pricedTokens')}
                    </small>
                </div>

                <div className="wallet-inspector__metric">
                    <span>{t('walletInspector.nfts')}</span>
                    <strong>{formatNumber(result.nftCount, language)}</strong>
                </div>

                <div className="wallet-inspector__metric">
                    <span>{t('walletInspector.topHolding')}</span>
                    <strong>{result.topHolding?.symbol ?? '-'}</strong>
                    <small>
                        {result.topHolding?.allocation
                            ? formatPercent(result.topHolding.allocation, language)
                            : formatUsd(result.topHolding?.valueUsd ?? 0, language)}
                    </small>
                </div>

                <a
                    href={`${result.network.explorer}/address/${result.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="wallet-inspector__explorer"
                >
                    {t('walletInspector.openExplorer')} <FiExternalLink />
                </a>
            </div>

            <div className="wallet-inspector__main-grid">
                <article className="wallet-inspector__panel wallet-inspector__allocation">
                    <div className="wallet-inspector__panel-head">
                        <h3>{t('walletInspector.allocation')}</h3>
                        <span>{formatUsd(result.portfolioValueUsd, language)}</span>
                    </div>

                    {result.allocationItems.length === 0 ? (
                        <p>{t('walletInspector.noPricedAssets')}</p>
                    ) : (
                        <div className="allocation-donut-layout">
                            <div
                                className="allocation-donut"
                                style={{background: getAllocationGradient(result.allocationItems)}}
                            >
                                <div>
                                    <strong>{formatUsd(result.portfolioValueUsd, language)}</strong>
                                    <span>{t('walletInspector.total')}</span>
                                </div>
                            </div>

                            <div className="allocation-legend">
                                {result.allocationItems.map((item, index) => (
                                    <div key={item.symbol} className="allocation-legend-row">
                                        <i className={`allocation-color color-${index}`} />
                                        <strong>{item.symbol}</strong>
                                        <span>{formatPercent(item.allocation, language)}</span>
                                        <em>{formatUsd(item.valueUsd, language)}</em>
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
                            onClick={onShowAllTokens}
                        >
                            {t('walletInspector.viewAll')} · {result.tokenCount}
                        </button>
                    </div>

                    {result.topTokens.length === 0 ? (
                        <p>{t('walletInspector.noTokens')}</p>
                    ) : (
                        <div className="wallet-token-list">
                            {result.topTokens.map((token) => (
                                <WalletTokenRow key={token.contract} token={token} />
                            ))}
                        </div>
                    )}
                </article>

                <article className="wallet-inspector__panel wallet-inspector__nfts-panel">
                    <div className="wallet-inspector__panel-head">
                        <h3>{t('walletInspector.nfts')}</h3>
                        <button
                            type="button"
                            className="wallet-inspector__view-all"
                            onClick={onShowAllNfts}
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
                                    onClick={() => onSelectNft(nft)}
                                >
                                    <img src={nft.image} alt={nft.name} />
                                    <strong>{nft.name}</strong>
                                    <span>{nft.collection}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </>
    )
}

export default WalletInspectorResults
