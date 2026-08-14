import {FiSearch} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'

const getTokenBadge = (token, t) => {
    if (token.catalog) return t('donationPanel.badges.catalog')
    if (token.custom) return t('donationPanel.badges.custom')
    if (token.type === 'native') return t('donationPanel.badges.native')
    return t('donationPanel.badges.erc20')
}

const DonationTokenSelector = ({
    children,
    filteredTokens,
    search,
    selectedTokenId,
    onSearch,
    onSelect,
}) => {
    const {t} = useTranslation('web3')

    return (
        <div className="donation-panel__selector">
            <label htmlFor="donation-token-search">{t('donationPanel.networkToken')}</label>

            <div className="donation-panel__search">
                <FiSearch />
                <input
                    id="donation-token-search"
                    type="search"
                    value={search}
                    onChange={(event) => onSearch(event.target.value)}
                    placeholder={t('donationPanel.searchPlaceholder')}
                />
            </div>

            <div className={`donation-panel__tokens ${search.trim() ? 'searching' : ''}`}>
                {filteredTokens.map((token) => (
                    <button
                        key={token.id}
                        type="button"
                        className={`donation-panel__token ${
                            selectedTokenId === token.id ? 'active' : ''
                        }`}
                        onClick={() => onSelect(token.id)}
                        aria-pressed={selectedTokenId === token.id}
                    >
                        <div>
                            <strong>{token.symbol}</strong>
                            <span>{token.networkName}</span>
                        </div>
                        <small>{getTokenBadge(token, t)}</small>
                    </button>
                ))}
            </div>

            {!search.trim() && (
                <p className="donation-panel__mobile-help">{t('donationPanel.mobileHelp')}</p>
            )}

            {children}
        </div>
    )
}

export default DonationTokenSelector
