import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import {FiExternalLink, FiSearch, FiSend} from 'react-icons/fi'
import {DONATION_RECEIVER, SUPPORTED_DONATION_TOKENS} from '../../../../config/wallet.js'
import {TOKEN_CATALOG} from '../../../../config/tokenCatalog.js'
import {
    importCustomErc20Token,
    sendDonationTransaction,
} from '../utils/tokenUtils.js'
import './DonationPanel.css'

const DonationPanel = () => {
    const {t} = useTranslation('web3')

    const [search, setSearch] = useState('')
    const [customTokens, setCustomTokens] = useState([])
    const [selectedTokenId, setSelectedTokenId] = useState(SUPPORTED_DONATION_TOKENS[0].id)

    const [amount, setAmount] = useState('')
    const [txHash, setTxHash] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [customChainHex, setCustomChainHex] = useState('0x1')
    const [customChainName, setCustomChainName] = useState('Ethereum')
    const [customExplorer, setCustomExplorer] = useState('https://etherscan.io/')
    const [customContract, setCustomContract] = useState('')
    const [importingToken, setImportingToken] = useState(false)

    const allTokens = useMemo(
        () => [...SUPPORTED_DONATION_TOKENS, ...TOKEN_CATALOG, ...customTokens],
        [customTokens]
    )

    const selectedToken = useMemo(
        () => allTokens.find((token) => token.id === selectedTokenId),
        [allTokens, selectedTokenId]
    )

    const filteredTokens = useMemo(() => {
        const q = search.trim().toLowerCase()

        if (!q) {
            return SUPPORTED_DONATION_TOKENS
        }

        return allTokens
            .filter((token) =>
                `${token.networkName} ${token.symbol} ${token.name ?? ''}`
                    .toLowerCase()
                    .includes(q)
            )
            .slice(0, 40)
    }, [allTokens, search])

    const handleImportToken = async () => {
        setError('')

        try {
            setImportingToken(true)

            const importedToken = await importCustomErc20Token({
                chainHex: customChainHex,
                chainName: customChainName,
                explorer: customExplorer,
                contractAddress: customContract,
            })

            setCustomTokens((previous) => {
                const alreadyExists = previous.some((token) => token.id === importedToken.id)

                if (alreadyExists) {
                    return previous
                }

                return [...previous, importedToken]
            })

            setSelectedTokenId(importedToken.id)
            setCustomContract('')
        } catch (err) {
            console.error(err)

            if (err.message === 'NO_PROVIDER') {
                setError(t('donationPanel.errors.noProvider'))
            } else if (err.message === 'INVALID_TOKEN_ADDRESS') {
                setError(t('donationPanel.errors.invalidTokenAddress'))
            } else {
                setError(t('donationPanel.errors.importFailed'))
            }
        } finally {
            setImportingToken(false)
        }
    }

    const sendDonation = async (event) => {
        event.preventDefault()
        setError('')
        setTxHash('')

        if (!selectedToken) {
            setError(t('donationPanel.errors.noToken'))
            return
        }

        if (!amount || Number(amount) <= 0) {
            setError(t('donationPanel.errors.invalidAmount'))
            return
        }

        try {
            setLoading(true)

            const hash = await sendDonationTransaction({
                token: selectedToken,
                amount,
                receiver: DONATION_RECEIVER,
            })

            setTxHash(hash)
        } catch (err) {
            console.error(err)

            if (err.message === 'NO_PROVIDER') {
                setError(t('donationPanel.errors.noProvider'))
            } else if (err.code === 4001) {
                setError(t('donationPanel.errors.cancelled'))
            } else {
                setError(t('donationPanel.errors.failed'))
            }
        } finally {
            setLoading(false)
        }
    }

    const [showCustomImport, setShowCustomImport] = useState(false)

    return (
        <section id="donation">
            <h5>{t('donationPanel.kicker')}</h5>
            <h2>{t('donationPanel.title')}</h2>

            <motion.article
                className="container donation-panel"
                initial={{opacity: 0, y: 35}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.55}}
            >
                <div className="donation-panel__content">
                    <div>
                        <h3>{t('donationPanel.heading')}</h3>
                        <p>{t('donationPanel.subtitle')}</p>
                    </div>

                    <div className="donation-panel__receiver">
                        <span>{t('donationPanel.receiver')}</span>
                        <code title={DONATION_RECEIVER}>
                            {DONATION_RECEIVER}
                        </code>
                    </div>
                </div>

                <div className="donation-panel__selector">
                    <label>{t('donationPanel.networkToken')}</label>

                    <div className="donation-panel__search">
                        <FiSearch/>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                onClick={() => setSelectedTokenId(token.id)}
                            >
                                <div>
                                    <strong>{token.symbol}</strong>
                                    <span>{token.networkName}</span>
                                </div>

                                <small>
                                    {token.catalog
                                        ? t('donationPanel.badges.catalog')
                                        : token.custom
                                            ? t('donationPanel.badges.custom')
                                            : token.type === 'native'
                                                ? t('donationPanel.badges.native')
                                                : t('donationPanel.badges.erc20')}
                                </small>
                            </button>
                        ))}
                    </div>

                    <div className={`donation-panel__custom ${showCustomImport ? 'open' : ''}`}>
                        <button
                            type="button"
                            className="donation-panel__custom-toggle"
                            onClick={() => setShowCustomImport((prev) => !prev)}
                        >
                            {showCustomImport
                                ? t('donationPanel.custom.hide')
                                : t('donationPanel.custom.show')}
                        </button>

                        {showCustomImport && (
                            <div className="donation-panel__custom-content">
                                <h4>{t('donationPanel.custom.title')}</h4>
                                <p>{t('donationPanel.custom.text')}</p>

                                <div className="donation-panel__custom-grid">
                                    <input
                                        type="text"
                                        value={customChainHex}
                                        onChange={(e) => setCustomChainHex(e.target.value)}
                                        placeholder={t('donationPanel.custom.chainHex')}
                                    />

                                    <input
                                        type="text"
                                        value={customChainName}
                                        onChange={(e) => setCustomChainName(e.target.value)}
                                        placeholder={t('donationPanel.custom.chainName')}
                                    />

                                    <input
                                        type="text"
                                        value={customExplorer}
                                        onChange={(e) => setCustomExplorer(e.target.value)}
                                        placeholder={t('donationPanel.custom.explorer')}
                                    />

                                    <input
                                        type="text"
                                        value={customContract}
                                        onChange={(e) => setCustomContract(e.target.value)}
                                        placeholder={t('donationPanel.custom.contract')}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handleImportToken}
                                    disabled={importingToken}
                                >
                                    {importingToken
                                        ? t('donationPanel.custom.importing')
                                        : t('donationPanel.custom.import')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <form className="donation-panel__form" onSubmit={sendDonation}>
                    <input
                        type="number"
                        min="0"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={t('donationPanel.amountPlaceholder', {
                            symbol: selectedToken?.symbol ?? 'token',
                        })}
                    />

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FiSend/>
                        {loading
                            ? t('donationPanel.sending')
                            : t('donationPanel.send', {
                                symbol: selectedToken?.symbol ?? '',
                            })}
                    </button>
                </form>

                {txHash && selectedToken?.explorer && (
                    <a
                        className="donation-panel__tx"
                        href={`${selectedToken.explorer}tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('donationPanel.viewTx')} <FiExternalLink/>
                    </a>
                )}

                {error && <p className="donation-panel__error">{error}</p>}
            </motion.article>
        </section>
    )
}

export default DonationPanel