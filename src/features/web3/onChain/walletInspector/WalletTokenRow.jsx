import {useTranslation} from 'react-i18next'
import {formatUsd} from './walletFormatters.js'
import {formatNumber, formatPercent} from '../../../../i18n/formatters.js'

const WalletTokenRow = ({token}) => {
    const {t, i18n} = useTranslation('web3')
    const language = i18n.resolvedLanguage ?? i18n.language

    return (
        <article className="wallet-token-row">
            {token.logo ? (
                <img src={token.logo} alt="" />
            ) : (
                <div className="wallet-token-fallback">{token.symbol.slice(0, 1)}</div>
            )}

            <div>
                <strong>{token.symbol}</strong>
                <span>{token.name}</span>
            </div>

            <div>
                <strong>
                    {token.valueUsd > 0
                        ? formatUsd(token.valueUsd, language)
                        : t('walletInspector.unpriced')}
                </strong>
                <span>{formatNumber(token.balance, language, {maximumFractionDigits: 4})}</span>
            </div>

            <em>{token.valueUsd > 0 ? formatPercent(token.allocation, language) : '-'}</em>
        </article>
    )
}

export default WalletTokenRow
