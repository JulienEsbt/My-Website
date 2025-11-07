import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {BrowserProvider, parseEther} from 'ethers'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state'
import Popover from '@mui/material/Popover'
import ETH from '../../../assets/crypto/ETH.jpeg'
import './donation.css'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {LINKS} from '../../../config/links'

gsap.registerPlugin(ScrollTrigger)

// TODO : Classe à revoir pour améliorer !

// Mapping chainId -> name + explorer
const CHAINS = {
    1n: {name: 'Ethereum (Mainnet)', scan: 'https://etherscan.io/'},
    5n: {name: 'Goerli (Testnet)', scan: 'https://goerli.etherscan.io/'}, // legacy testnet
    137n: {name: 'Polygon (Mainnet)', scan: 'https://polygonscan.com/'},
    80001n: {name: 'Mumbai (Polygon Testnet)', scan: 'https://mumbai.polygonscan.com/'}, // legacy testnet
    56n: {name: 'Binance Smart Chain (BSC)', scan: 'https://bscscan.com/'},
    100n: {name: 'Gnosis (xDai)', scan: 'https://blockscout.com/xdai/mainnet/'}
}

// -------- Transaction util
const sendETH = async ({ether, receiver}) => {
    try {
        const {ethereum} = window
        if (!ethereum) return null
        const provider = new BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const tx = await signer.sendTransaction({
            to: receiver,
            value: parseEther(String(ether || '0'))
        })
        const receipt = await tx.wait()
        return receipt?.hash || tx.hash
    } catch (err) {
        console.log(err)
        return null
    }
}

const Donation = () => {
    const {t} = useTranslation('crypto')

    // === GSAP Refs
    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const ctaRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // section
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'}
            })

            // avatar
            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px',
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'}
                }
            )
            gsap.to(imgRef.current, {
                '--ty': '-=6px',
                yoyo: true,
                repeat: -1,
                duration: 3,
                ease: 'sine.inOut'
            })

            // blocs (cartes / form / boutons)
            gsap.fromTo(
                cardsRef.current,
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px',
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 75%'}
                }
            )

            gsap.from(ctaRef.current, {
                opacity: 0,
                y: 16,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.1,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 70%'}
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    // === Wallet state
    const [currentAccount, setCurrentAccount] = useState()
    const [networkName, setNetworkName] = useState('Unknown network')
    const [etherscanBase, setEtherscanBase] = useState('')
    const [txHash, setTxHash] = useState('')
    const [isShown, setIsShown] = useState(false)

    const refreshNetwork = useCallback(async () => {
        try {
            if (!window.ethereum) return
            const provider = new BrowserProvider(window.ethereum)
            const {chainId} = await provider.getNetwork() // bigint
            const info = CHAINS[chainId]
            if (info) {
                setNetworkName(info.name)
                setEtherscanBase(info.scan)
            } else {
                setNetworkName(`${t('donation.network.unknown')} ${chainId.toString()}`)
                setEtherscanBase('')
            }
        } catch (e) {
            console.log(e)
        }
    }, [t])

    const checkIfWalletIsConnected = useCallback(async () => {
        if (!window.ethereum) return
        try {
            await refreshNetwork()
            const accounts = await window.ethereum.request({method: 'eth_accounts'})
            if (accounts?.length) setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }, [refreshNetwork])

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert(t('donation.wallet.noProvider'))
            return
        }
        try {
            await checkIfWalletIsConnected()
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
            if (accounts?.length) setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    // Adresse receveur centralisée (LINKS), fallback sur l’ancienne si absente
    const RECEIVER =
        LINKS.donations?.evmReceiver || '0x718a544638Fd113A58C1062E4b2E8a404b13D2eC'

    const makeTransaction = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const amount = data.get('ether')
        const hash = await sendETH({ether: amount, receiver: RECEIVER})
        if (hash) setTxHash(hash)
    }

    useEffect(() => {
        checkIfWalletIsConnected()

        if (window.ethereum) {
            const onChainChanged = () => refreshNetwork()
            const onAccountsChanged = (accounts) => setCurrentAccount(accounts?.[0])

            window.ethereum.on?.('chainChanged', onChainChanged)
            window.ethereum.on?.('accountsChanged', onAccountsChanged)
            return () => {
                window.ethereum.removeListener?.('chainChanged', onChainChanged)
                window.ethereum.removeListener?.('accountsChanged', onAccountsChanged)
            }
        }
    }, [checkIfWalletIsConnected, refreshNetwork])

    return (
        <section id="donation" ref={sectionRef}>
            <h5>{t('donation.kicker')}</h5>
            <h2>{t('donation.title')}</h2>

            <article className="donation container">
                <div className="network__avatar" ref={imgRef} aria-hidden>
                    <img src={ETH} alt={t('donation.alt.eth')}/>
                </div>

                {/* Network popover */}
                <PopupState>
                    {(popupState) => (
                        <div ref={(el) => (cardsRef.current[0] = el)}>
                            {currentAccount && (
                                <Button
                                    {...bindTrigger(popupState)}
                                    aria-label={t('donation.aria.showNetwork')}
                                >
                                    {t('donation.network.button')}
                                </Button>
                            )}
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                            >
                                <Typography sx={{p: 2}}>{networkName}</Typography>
                            </Popover>
                        </div>
                    )}
                </PopupState>

                {/* Connect wallet / helper */}
                <div className="network__name" ref={(el) => (cardsRef.current[1] = el)}>
                    {!currentAccount ? (
                        <>
                            <Button
                                onClick={connectWallet}
                                onMouseEnter={() => setIsShown(true)}
                                onMouseLeave={() => setIsShown(false)}
                                aria-label={t('donation.wallet.connect')}
                            >
                                {t('donation.wallet.connect')}
                            </Button>
                            {isShown && (
                                <div className="network__helper" role="note">
                                    {t('donation.wallet.helper')}
                                </div>
                            )}
                        </>
                    ) : (
                        <h5 className="network">
                            {t('donation.wallet.connected')} <span>{currentAccount}</span>
                        </h5>
                    )}
                </div>

                {/* Form */}
                <form
                    className="container donation__container eth"
                    onSubmit={makeTransaction}
                    ref={(el) => (cardsRef.current[2] = el)}
                >
                    <h5>{t('donation.form.title')}</h5>
                    <input
                        className="but"
                        name="ether"
                        type="text"
                        inputMode="decimal"
                        placeholder={t('donation.form.placeholder')}
                        aria-label={t('donation.form.placeholder')}
                    />
                    <button type="submit" className="but but-primary" ref={ctaRef}>
                        {t('donation.form.submit')}
                    </button>
                    <br/>
                    {etherscanBase && txHash ? (
                        <a
                            href={`${etherscanBase}tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="but but-primary"
                            ref={(el) => (cardsRef.current[3] = el)}
                        >
                            {t('donation.form.viewTx')}
                        </a>
                    ) : (
                        <Button disabled className="but but-primary">
                            {t('donation.form.noTx')}
                        </Button>
                    )}
                    <small className="receiver">
                        {t('donation.receiver', {addr: RECEIVER})}
                    </small>
                </form>
            </article>
        </section>
    )
}

export default Donation