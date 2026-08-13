import {useEffect, useMemo, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {FiCheck, FiCopy, FiExternalLink, FiSend} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {DONATION_RECEIVER, SUPPORTED_DONATION_TOKENS} from '../../../../config/wallet.js'
import CustomTokenImport from './CustomTokenImport.jsx'
import DonationTokenSelector from './DonationTokenSelector.jsx'
import './DonationPanel.css'

const DEFAULT_CUSTOM_FIELDS = {
    chainHex: '0x1',
    chainName: 'Ethereum',
    explorer: 'https://etherscan.io/',
    contract: '',
}

const DonationPanel = () => {
    const {t} = useTranslation('web3')
    const [search, setSearch] = useState('')
    const [catalogTokens, setCatalogTokens] = useState(null)
    const [customTokens, setCustomTokens] = useState([])
    const [selectedTokenId, setSelectedTokenId] = useState(SUPPORTED_DONATION_TOKENS[0].id)
    const [amount, setAmount] = useState('')
    const [txHash, setTxHash] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [customFields, setCustomFields] = useState(DEFAULT_CUSTOM_FIELDS)
    const [importingToken, setImportingToken] = useState(false)
    const [showCustomImport, setShowCustomImport] = useState(false)
    const [copied, setCopied] = useState(false)
    const copyTimerRef = useRef(null)

    useEffect(
        () => () => {
            clearTimeout(copyTimerRef.current)
        },
        []
    )

    useEffect(() => {
        if (!search.trim() || catalogTokens) return undefined

        let cancelled = false
        import('../../../../config/tokenCatalog.js')
            .then(({TOKEN_CATALOG}) => {
                if (!cancelled) setCatalogTokens(TOKEN_CATALOG)
            })
            .catch(() => {
                if (!cancelled) setCatalogTokens([])
            })

        return () => {
            cancelled = true
        }
    }, [catalogTokens, search])

    const allTokens = useMemo(
        () => [...SUPPORTED_DONATION_TOKENS, ...(catalogTokens ?? []), ...customTokens],
        [catalogTokens, customTokens]
    )
    const selectedToken = useMemo(
        () => allTokens.find((token) => token.id === selectedTokenId),
        [allTokens, selectedTokenId]
    )
    const filteredTokens = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return SUPPORTED_DONATION_TOKENS

        return allTokens
            .filter((token) =>
                `${token.networkName} ${token.symbol} ${token.name ?? ''}`
                    .toLowerCase()
                    .includes(query)
            )
            .slice(0, 40)
    }, [allTokens, search])

    const handleCustomFieldChange = (name, value) => {
        setCustomFields((previous) => ({...previous, [name]: value}))
    }

    const handleImportToken = async () => {
        setError('')
        setImportingToken(true)

        try {
            const {importCustomErc20Token} = await import('../utils/tokenUtils.js')
            const importedToken = await importCustomErc20Token({
                chainHex: customFields.chainHex,
                chainName: customFields.chainName,
                explorer: customFields.explorer,
                contractAddress: customFields.contract,
            })

            setCustomTokens((previous) =>
                previous.some((token) => token.id === importedToken.id)
                    ? previous
                    : [...previous, importedToken]
            )
            setSelectedTokenId(importedToken.id)
            setCustomFields((previous) => ({...previous, contract: ''}))
        } catch (importError) {
            if (importError.message === 'NO_PROVIDER') {
                setError(t('donationPanel.errors.noProvider'))
            } else if (importError.message === 'INVALID_TOKEN_ADDRESS') {
                setError(t('donationPanel.errors.invalidTokenAddress'))
            } else {
                if (import.meta.env.DEV) console.error(importError)
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

        setLoading(true)
        try {
            const {sendDonationTransaction} = await import('../utils/tokenUtils.js')
            const hash = await sendDonationTransaction({
                token: selectedToken,
                amount,
                receiver: DONATION_RECEIVER,
            })
            setTxHash(hash)
        } catch (transactionError) {
            if (transactionError.message === 'NO_PROVIDER') {
                setError(t('donationPanel.errors.noProvider'))
            } else if (transactionError.code === 4001) {
                setError(t('donationPanel.errors.cancelled'))
            } else {
                if (import.meta.env.DEV) console.error(transactionError)
                setError(t('donationPanel.errors.failed'))
            }
        } finally {
            setLoading(false)
        }
    }

    const copyAddress = async () => {
        try {
            await navigator.clipboard.writeText(DONATION_RECEIVER)
            setCopied(true)
            clearTimeout(copyTimerRef.current)
            copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <section id="donation">
            <p className="section-kicker">{t('donationPanel.kicker')}</p>
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
                        <p className="donation-panel__warning">{t('donationPanel.warning')}</p>
                    </div>

                    <div className="donation-panel__receiver">
                        <span>{t('donationPanel.receiver')}</span>
                        <div className="donation-panel__receiver-line">
                            <code title={DONATION_RECEIVER}>{DONATION_RECEIVER}</code>
                            <button
                                type="button"
                                className="donation-panel__copy"
                                onClick={copyAddress}
                                aria-label={t('donationPanel.copyAddress')}
                            >
                                {copied ? <FiCheck /> : <FiCopy />}
                            </button>
                        </div>
                    </div>
                </div>

                <DonationTokenSelector
                    filteredTokens={filteredTokens}
                    search={search}
                    selectedTokenId={selectedTokenId}
                    onSearch={setSearch}
                    onSelect={setSelectedTokenId}
                >
                    <CustomTokenImport
                        fields={customFields}
                        importing={importingToken}
                        open={showCustomImport}
                        onChange={handleCustomFieldChange}
                        onImport={handleImportToken}
                        onToggle={() => setShowCustomImport((previous) => !previous)}
                    />
                </DonationTokenSelector>

                <form className="donation-panel__form" onSubmit={sendDonation}>
                    <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder={t('donationPanel.amountPlaceholder', {
                            symbol: selectedToken?.symbol ?? 'token',
                        })}
                        aria-label={t('donationPanel.amountLabel', {
                            symbol: selectedToken?.symbol ?? 'token',
                        })}
                        aria-invalid={error ? 'true' : undefined}
                        aria-describedby={error ? 'donation-panel-error' : undefined}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FiSend />
                        {loading
                            ? t('donationPanel.sending')
                            : t('donationPanel.send', {symbol: selectedToken?.symbol ?? ''})}
                    </button>
                </form>

                {txHash && selectedToken?.explorer && (
                    <a
                        className="donation-panel__tx"
                        href={`${selectedToken.explorer}tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('donationPanel.viewTx')} <FiExternalLink />
                    </a>
                )}

                {error && (
                    <p id="donation-panel-error" className="donation-panel__error" role="alert">
                        {error}
                    </p>
                )}
            </motion.article>
        </section>
    )
}

export default DonationPanel
