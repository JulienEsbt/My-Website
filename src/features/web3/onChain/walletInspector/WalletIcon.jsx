import {useState} from 'react'
import {TbWallet} from 'react-icons/tb'
import {safeWalletIcon} from '../../../../services/web3/walletDiscovery.ts'

export default function WalletIcon({icon}) {
    const [failed, setFailed] = useState(false)
    return (
        <span className="wallet-icon" aria-hidden="true">
            {!failed && safeWalletIcon(icon) ? (
                <img src={icon} alt="" width="40" height="40" onError={() => setFailed(true)} />
            ) : (
                <TbWallet />
            )}
        </span>
    )
}
