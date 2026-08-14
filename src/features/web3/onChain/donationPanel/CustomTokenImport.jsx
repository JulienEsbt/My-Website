import {useTranslation} from 'react-i18next'

const CustomTokenImport = ({chains, fields, importing, open, onChange, onImport, onToggle}) => {
    const {t} = useTranslation('web3')

    return (
        <div className={`donation-panel__custom ${open ? 'open' : ''}`}>
            <button
                type="button"
                className="donation-panel__custom-toggle"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="custom-token-import"
            >
                {open ? t('donationPanel.custom.hide') : t('donationPanel.custom.show')}
            </button>

            {open && (
                <div id="custom-token-import" className="donation-panel__custom-content">
                    <h4>{t('donationPanel.custom.title')}</h4>
                    <p>{t('donationPanel.custom.text')}</p>

                    <div className="donation-panel__custom-grid">
                        <select
                            value={fields.chainHex}
                            onChange={(event) => onChange('chainHex', event.target.value)}
                            aria-label={t('donationPanel.custom.chainHex')}
                        >
                            {chains.map((chain) => (
                                <option key={chain.chainHex} value={chain.chainHex}>
                                    {chain.name}
                                </option>
                            ))}
                        </select>
                        {Object.entries(fields)
                            .filter(([name]) => name !== 'chainHex')
                            .map(([name, value]) => (
                                <input
                                    key={name}
                                    type="text"
                                    value={value}
                                    onChange={(event) => onChange(name, event.target.value)}
                                    placeholder={t(`donationPanel.custom.${name}`)}
                                    aria-label={t(`donationPanel.custom.${name}`)}
                                />
                            ))}
                    </div>

                    <button type="button" className="btn" onClick={onImport} disabled={importing}>
                        {importing
                            ? t('donationPanel.custom.importing')
                            : t('donationPanel.custom.import')}
                    </button>
                </div>
            )}
        </div>
    )
}

export default CustomTokenImport
