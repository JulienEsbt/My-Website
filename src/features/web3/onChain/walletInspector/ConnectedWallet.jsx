import {useEffect, useRef, useState} from 'react'
import {FiRefreshCw, FiLogOut, FiRepeat} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {walletAccounts, walletConnectionError} from '../../../../services/web3/walletDiscovery.ts'
import WalletIcon from './WalletIcon.jsx'

export default function ConnectedWallet({wallet, onAddress, onDisconnect, onChangeWallet}) {
    const {t} = useTranslation('web3')
    const [accounts, setAccounts] = useState(wallet.accounts)
    const [selected, setSelected] = useState(wallet.accounts[0])
    const [error, setError] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const selectedRef = useRef(selected)
    const callback = useRef(onAddress)
    callback.current = onAddress
    const refreshRef = useRef(null)

    useEffect(() => {
        let alive = true
        let revision = 0
        const apply = (value, followWallet) => {
            const next = walletAccounts(value)
            const current = selectedRef.current
            const chosen =
                (!followWallet && next.find((a) => a.toLowerCase() === current?.toLowerCase())) ||
                next[0] ||
                ''
            setAccounts(next)
            setError('')
            setSelected(chosen)
            selectedRef.current = chosen
            if (chosen.toLowerCase() !== current?.toLowerCase()) callback.current(chosen)
        }
        const changed = (value) => {
            if (!alive) return
            revision++
            setRefreshing(false)
            try {
                apply(value, true)
            } catch {
                setError('connectionFailed')
            }
        }
        const disconnected = () => changed([])
        const refresh = async () => {
            const request = ++revision
            setRefreshing(true)
            setError('')
            try {
                const value = await wallet.provider.request({method: 'eth_accounts'})
                if (alive && request === revision) apply(value, false)
            } catch (failure) {
                if (alive && request === revision) setError(walletConnectionError(failure))
            } finally {
                if (alive && request === revision) setRefreshing(false)
            }
        }
        refreshRef.current = refresh
        wallet.provider.on?.('accountsChanged', changed)
        wallet.provider.on?.('disconnect', disconnected)
        // Reconcile a change that occurred between the permission response and mounting.
        void refresh()
        return () => {
            alive = false
            revision++
            wallet.provider.removeListener?.('accountsChanged', changed)
            wallet.provider.removeListener?.('disconnect', disconnected)
        }
    }, [wallet])

    return (
        <div className="wallet-session">
            <div className="wallet-session__heading">
                <WalletIcon icon={wallet.icon} />
                <div>
                    <strong>
                        {wallet.name || t('walletInspector.picker.legacy', {number: 1})}
                    </strong>
                    <span role="status">
                        {t(`walletInspector.session.${accounts.length ? 'connected' : 'locked'}`)}
                    </span>
                </div>
            </div>
            {accounts.length > 0 && (
                <div className="wallet-session__account">
                    <label htmlFor="wallet-authorized-account">
                        {t('walletInspector.session.account')}
                    </label>
                    <select
                        id="wallet-authorized-account"
                        value={selected}
                        onChange={(event) => {
                            const next = event.target.value
                            selectedRef.current = next
                            setSelected(next)
                            onAddress(next)
                        }}
                    >
                        {accounts.map((account, index) => (
                            <option key={account} value={account}>
                                {index + 1} · {account.slice(0, 8)}…{account.slice(-6)}
                            </option>
                        ))}
                    </select>
                    <code>{selected}</code>
                </div>
            )}
            <p>{t('walletInspector.session.help')}</p>
            <div className="wallet-session__actions">
                <button
                    type="button"
                    className="btn"
                    disabled={refreshing}
                    onClick={() => refreshRef.current?.()}
                >
                    <FiRefreshCw aria-hidden="true" />
                    {t('walletInspector.session.refresh')}
                </button>
                <button type="button" className="btn" onClick={onChangeWallet}>
                    <FiRepeat aria-hidden="true" />
                    {t('walletInspector.session.change')}
                </button>
                <button type="button" className="btn" onClick={onDisconnect}>
                    <FiLogOut aria-hidden="true" />
                    {t('walletInspector.session.disconnect')}
                </button>
            </div>
            {error && (
                <p role="alert" className="wallet-inspector__error">
                    {t(`walletInspector.errors.${error}`)}
                </p>
            )}
        </div>
    )
}
