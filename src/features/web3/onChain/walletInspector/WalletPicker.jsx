import {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {FiX, FiArrowUpRight} from 'react-icons/fi'
import WalletIcon from './WalletIcon.jsx'
import {useTranslation} from 'react-i18next'
import useFocusTrap from '../../../../components/common/accessibility/useFocusTrap.js'
import {
    discoverWallets,
    requestWalletAccounts,
    walletConnectionError,
} from '../../../../services/web3/walletDiscovery.ts'

export default function WalletPicker({onClose, onConnected}) {
    const {t} = useTranslation('web3')
    const [wallets, setWallets] = useState([])
    const [qr, setQr] = useState(null)
    const [copied, setCopied] = useState(false)
    const walletConnectController = useRef(null)
    const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim()
    const [pending, setPending] = useState(null)
    const [error, setError] = useState('')
    const dialog = useRef(null)
    const close = useRef(null)
    const alive = useRef(true)
    const busy = useRef(false)
    useFocusTrap({active: true, containerRef: dialog, initialFocusRef: close, onDismiss: onClose})
    useEffect(() => {
        alive.current = true
        const unsubscribe = discoverWallets(setWallets)
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            alive.current = false
            walletConnectController.current?.abort()
            unsubscribe()
            document.body.style.overflow = previous
        }
    }, [])
    const connect = async (wallet) => {
        if (busy.current) return
        busy.current = true
        setPending(wallet.id)
        setError('')
        try {
            const accounts = await requestWalletAccounts(wallet.provider)
            if (alive.current) onConnected(accounts[0], {...wallet, accounts})
        } catch (failure) {
            if (alive.current) setError(walletConnectionError(failure))
        } finally {
            busy.current = false
            if (alive.current) setPending(null)
        }
    }
    const connectMobile = async () => {
        if (busy.current) return
        busy.current = true
        setPending('walletconnect')
        setError('')
        setCopied(false)
        const controller = new AbortController()
        walletConnectController.current = controller
        try {
            const {connectWalletConnect} =
                await import('../../../../services/web3/walletConnect.ts')
            const address = await connectWalletConnect({
                projectId,
                signal: controller.signal,
                onQr: (value) => {
                    if (alive.current) setQr(value)
                },
            })
            if (alive.current && !controller.signal.aborted) onConnected(address)
        } catch (failure) {
            if (alive.current && !controller.signal.aborted)
                setError(walletConnectionError(failure))
        } finally {
            busy.current = false
            if (alive.current) {
                setPending(null)
                setQr(null)
            }
        }
    }
    return createPortal(
        <div className="wallet-inspector__modal" onClick={onClose}>
            <div
                ref={dialog}
                className="wallet-inspector__modal-content wallet-picker"
                role="dialog"
                aria-modal="true"
                aria-labelledby="wallet-picker-title"
                aria-describedby="wallet-picker-description"
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    ref={close}
                    className="wallet-inspector__modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label={t('walletInspector.closeDialog')}
                >
                    <FiX aria-hidden="true" />
                </button>
                <span className="wallet-picker__eyebrow">
                    {t('walletInspector.picker.eyebrow')}
                </span>
                <h3 id="wallet-picker-title">{t('walletInspector.picker.title')}</h3>
                <p id="wallet-picker-description">{t('walletInspector.picker.description')}</p>
                <div className="wallet-picker__list" aria-busy={Boolean(pending)}>
                    {wallets.map((wallet, index) => (
                        <button
                            type="button"
                            key={wallet.id}
                            disabled={Boolean(pending)}
                            onClick={() => connect(wallet)}
                        >
                            <WalletIcon icon={wallet.icon} />
                            <span>
                                <strong>
                                    {wallet.legacy
                                        ? t('walletInspector.picker.legacy', {number: index + 1})
                                        : wallet.name}
                                </strong>
                                <small>
                                    {pending === wallet.id
                                        ? t('walletInspector.picker.waiting')
                                        : t(
                                              `walletInspector.picker.${wallet.legacy ? 'legacyHint' : 'detected'}`
                                          )}
                                </small>
                            </span>
                            <FiArrowUpRight aria-hidden="true" />
                        </button>
                    ))}
                </div>
                {projectId && (
                    <div className="wallet-picker__remote">
                        {!qr && (
                            <button
                                type="button"
                                className="btn"
                                disabled={Boolean(pending)}
                                onClick={connectMobile}
                            >
                                WalletConnect · {t('walletInspector.picker.qrButton')}
                            </button>
                        )}
                        <p>{t('walletInspector.picker.relay')}</p>
                        {qr && (
                            <>
                                <img
                                    className="wallet-picker__qr"
                                    src={qr.image}
                                    alt={t('walletInspector.picker.qrAlt')}
                                />
                                <p>{t('walletInspector.picker.scan')}</p>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(qr.uri)
                                            setCopied(true)
                                        } catch {
                                            setError('copyFailed')
                                        }
                                    }}
                                >
                                    {t(`walletInspector.picker.${copied ? 'copied' : 'copy'}`)}
                                </button>
                            </>
                        )}
                        {pending === 'walletconnect' && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() => walletConnectController.current?.abort()}
                            >
                                {t('walletInspector.picker.cancel')}
                            </button>
                        )}
                    </div>
                )}
                {!wallets.length && <p role="status">{t('walletInspector.picker.empty')}</p>}
                {pending && (
                    <p role="status">
                        {t(
                            `walletInspector.picker.${pending === 'walletconnect' ? 'waitingMobile' : 'waiting'}`
                        )}
                    </p>
                )}
                {error && (
                    <p className="wallet-inspector__error" role="alert">
                        {t(`walletInspector.errors.${error}`)}
                    </p>
                )}
                <button type="button" className="btn" onClick={onClose}>
                    {t('walletInspector.picker.manual')}
                </button>
            </div>
        </div>,
        document.body
    )
}
