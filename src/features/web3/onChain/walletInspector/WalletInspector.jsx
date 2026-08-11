import {lazy, Suspense, useEffect, useMemo, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {FiSearch} from 'react-icons/fi'
import {TbWallet} from 'react-icons/tb'
import {useTranslation} from 'react-i18next'
import FeatureLoading from '../../../../components/common/feedback/featureLoading/FeatureLoading.jsx'
import {BLOCKCHAIN_NETWORKS} from '../../../../config/blockchains.js'
import WalletInspectorResults from './WalletInspectorResults.jsx'
import './WalletInspector.css'

const WalletInspectorDialogs = lazy(() => import('./WalletInspectorDialogs.jsx'))

const WalletInspector = () => {
    const {t} = useTranslation('web3')
    const [address, setAddress] = useState('')
    const [selectedNetworkId, setSelectedNetworkId] = useState('ethereum')
    const [result, setResult] = useState(null)
    const [selectedNft, setSelectedNft] = useState(null)
    const [showAllTokens, setShowAllTokens] = useState(false)
    const [showAllNfts, setShowAllNfts] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const requestIdRef = useRef(0)
    const abortControllerRef = useRef(null)

    const selectedNetwork = useMemo(
        () => BLOCKCHAIN_NETWORKS.find((network) => network.id === selectedNetworkId),
        [selectedNetworkId]
    )

    useEffect(
        () => () => {
            requestIdRef.current += 1
            abortControllerRef.current?.abort()
        },
        []
    )

    const getTranslatedError = (errorCode) => {
        if (errorCode === 'MISSING_RPC') return t('walletInspector.errors.missingRpc')
        if (errorCode === 'INVALID_ADDRESS') return t('walletInspector.errors.invalidAddress')
        return t('walletInspector.errors.failed')
    }

    const inspectAddress = async (walletInput) => {
        const requestId = ++requestIdRef.current
        abortControllerRef.current?.abort()
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        setLoading(true)
        setError('')
        setResult(null)

        try {
            const {inspectWalletPortfolio} =
                await import('../../../../services/web3/walletInspectorService.js')
            const inspectedWallet = await inspectWalletPortfolio({
                walletInput,
                network: selectedNetwork,
                signal: abortController.signal,
            })

            if (requestId === requestIdRef.current) setResult(inspectedWallet)
        } catch (inspectionError) {
            if (abortController.signal.aborted || requestId !== requestIdRef.current) return
            if (!['MISSING_RPC', 'INVALID_ADDRESS'].includes(inspectionError.message)) {
                console.error(inspectionError)
            }
            setError(getTranslatedError(inspectionError.message))
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false)
                abortControllerRef.current = null
            }
        }
    }

    const changeNetwork = (event) => {
        requestIdRef.current += 1
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        setSelectedNetworkId(event.target.value)
        setResult(null)
        setError('')
        setLoading(false)
    }

    const inspectWallet = async (event) => {
        event.preventDefault()
        await inspectAddress(address)
    }

    const connectCurrentWallet = async () => {
        const requestId = ++requestIdRef.current
        abortControllerRef.current?.abort()
        abortControllerRef.current = null

        if (!window.ethereum) {
            setError(t('walletInspector.errors.noProvider'))
            setLoading(false)
            return
        }

        setLoading(true)
        setError('')

        try {
            const {connectInjectedWallet} =
                await import('../../../../services/web3/walletInspectorService.js')
            const connectedAddress = await connectInjectedWallet()
            if (requestId !== requestIdRef.current) return

            setAddress(connectedAddress)
            await inspectAddress(connectedAddress)
        } catch (connectionError) {
            if (requestId !== requestIdRef.current) return
            console.error(connectionError)
            setError(t('walletInspector.errors.failed'))
        } finally {
            if (requestId === requestIdRef.current) setLoading(false)
        }
    }

    const hasOpenDialog = showAllTokens || showAllNfts || Boolean(selectedNft)

    return (
        <section id="wallet-inspector">
            <p className="section-kicker">{t('walletInspector.kicker')}</p>
            <h2>{t('walletInspector.title')}</h2>

            <motion.div
                className="container wallet-inspector"
                initial={{opacity: 0, y: 35}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.55}}
            >
                <form className="wallet-inspector__searchbar" onSubmit={inspectWallet}>
                    <label className="sr-only" htmlFor="wallet-network">
                        {t('walletInspector.networkLabel')}
                    </label>
                    <select id="wallet-network" value={selectedNetworkId} onChange={changeNetwork}>
                        {BLOCKCHAIN_NETWORKS.map((network) => (
                            <option key={network.id} value={network.id}>
                                {network.name}
                            </option>
                        ))}
                    </select>

                    <label className="sr-only" htmlFor="wallet-address">
                        {t('walletInspector.addressLabel')}
                    </label>
                    <input
                        id="wallet-address"
                        type="text"
                        autoComplete="off"
                        required
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder={t('walletInspector.placeholder')}
                        aria-invalid={error ? 'true' : undefined}
                        aria-describedby={error ? 'wallet-inspector-error' : undefined}
                    />

                    {result?.ens && <span className="wallet-inspector__ens-valid">✓ ENS</span>}

                    <button className="btn btn-primary" disabled={loading}>
                        <FiSearch />
                        {loading ? t('walletInspector.loading') : t('walletInspector.inspect')}
                    </button>

                    <button
                        type="button"
                        className="btn wallet-inspector__connect"
                        onClick={connectCurrentWallet}
                        disabled={loading}
                    >
                        <TbWallet />
                        {t('walletInspector.connect')}
                    </button>
                </form>

                {error && (
                    <p id="wallet-inspector-error" className="wallet-inspector__error" role="alert">
                        {error}
                    </p>
                )}

                {result && (
                    <WalletInspectorResults
                        result={result}
                        onSelectNft={setSelectedNft}
                        onShowAllNfts={() => setShowAllNfts(true)}
                        onShowAllTokens={() => setShowAllTokens(true)}
                    />
                )}
            </motion.div>

            {hasOpenDialog && (
                <Suspense fallback={<FeatureLoading />}>
                    <WalletInspectorDialogs
                        result={result}
                        selectedNft={selectedNft}
                        showAllNfts={showAllNfts}
                        showAllTokens={showAllTokens}
                        onSelectNft={setSelectedNft}
                        onShowAllNfts={setShowAllNfts}
                        onShowAllTokens={setShowAllTokens}
                    />
                </Suspense>
            )}
        </section>
    )
}

export default WalletInspector
