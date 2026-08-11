import {useTranslation} from 'react-i18next'
import {formatUsd} from './walletFormatters.js'

const WalletTokenRow = ({token}) => {
    const {t} = useTranslation('web3')

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
                    {token.valueUsd > 0 ? formatUsd(token.valueUsd) : t('walletInspector.unpriced')}
                </strong>
                <span>
                    {Number(token.balance).toLocaleString(undefined, {maximumFractionDigits: 4})}
                </span>
            </div>

            <em>{token.valueUsd > 0 ? `${token.allocation.toFixed(1)}%` : '-'}</em>
        </article>
    )
}

export default WalletTokenRow
