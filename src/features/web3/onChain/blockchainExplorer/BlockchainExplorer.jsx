import React, {useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import {JsonRpcProvider, formatUnits} from 'ethers'
import {motion} from 'framer-motion'
import {FiExternalLink, FiRefreshCw} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {BLOCKCHAIN_NETWORKS} from '../../../../config/blockchains.js'
import './BlockchainExplorer.css'

const RPC_URLS = {
    VITE_ETH_RPC_URL: import.meta.env.VITE_ETH_RPC_URL,
    VITE_POLYGON_RPC_URL: import.meta.env.VITE_POLYGON_RPC_URL,
    VITE_ARBITRUM_RPC_URL: import.meta.env.VITE_ARBITRUM_RPC_URL,
    VITE_OPTIMISM_RPC_URL: import.meta.env.VITE_OPTIMISM_RPC_URL,
    VITE_BNB_RPC_URL: import.meta.env.VITE_BNB_RPC_URL,
}

const getRpcUrl = (rpcEnv) => RPC_URLS[rpcEnv]

const formatGwei = (value) => {
    if (!value) return null
    return Number(formatUnits(value, 'gwei')).toFixed(2)
}

const BlockchainExplorer = () => {
    const {t} = useTranslation('web3')

    const [networks, setNetworks] = useState([])
    const [loading, setLoading] = useState(false)

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: 'start',
            dragFree: true,
            containScroll: false,
        },
        [
            AutoScroll({
                speed: 0.7,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        ]
    )

    const getStatusLabel = (status) => {
        if (status === 'online') return t('blockchainExplorer.status.online')
        if (status === 'missing-rpc') return t('blockchainExplorer.status.missingRpc')
        return t('blockchainExplorer.status.error')
    }

    const loadNetworks = async () => {
        setLoading(true)

        const results = await Promise.all(
            BLOCKCHAIN_NETWORKS.map(async (network) => {
                const rpcUrl = getRpcUrl(network.rpcEnv)

                if (!rpcUrl) {
                    return {...network, status: 'missing-rpc'}
                }

                try {
                    const provider = new JsonRpcProvider(rpcUrl)

                    const [blockNumber, feeData, networkInfo] = await Promise.all([
                        provider.getBlockNumber(),
                        provider.getFeeData(),
                        provider.getNetwork(),
                    ])

                    return {
                        ...network,
                        status: 'online',
                        chainId: networkInfo.chainId.toString(),
                        blockNumber,
                        gasPrice: formatGwei(feeData.gasPrice),
                        maxFee: formatGwei(feeData.maxFeePerGas),
                        priorityFee: formatGwei(feeData.maxPriorityFeePerGas),
                    }
                } catch (error) {
                    console.error(`Error loading ${network.name}`, error)
                    return {...network, status: 'error'}
                }
            })
        )

        setNetworks(results)
        setLoading(false)
    }

    const carouselNetworks = networks.length > 0
        ? Array.from({length: 4}).flatMap(() => networks)
        : []

    useEffect(() => {
        loadNetworks()
    }, [])

    return (
        <section id="blockchain-explorer" className="blockchain-section">
            <h5>{t('blockchainExplorer.kicker')}</h5>
            <h2>{t('blockchainExplorer.title')}</h2>

            <div className="container blockchain-explorer__top">
                <p>{t('blockchainExplorer.description')}</p>

                <button className="btn" onClick={loadNetworks} disabled={loading}>
                    <FiRefreshCw/>
                    {loading
                        ? t('blockchainExplorer.refreshing')
                        : t('blockchainExplorer.refresh')}
                </button>
            </div>

            <div className="container blockchain-embla">
                <div className="blockchain-embla__viewport" ref={emblaRef}>
                    <div className="blockchain-embla__container">
                        {carouselNetworks.map((network, index) => (
                            <motion.article
                                key={`${network.id}-${index}`}
                                className="blockchain-card"
                                initial={{opacity: 0, y: 24}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.4, delay: index * 0.05}}
                            >
                                <div className="blockchain-card__header">
                                    <div>
                                        <h3>{network.name}</h3>
                                        <span>{network.symbol}</span>
                                    </div>

                                    <small className={`status ${network.status}`}>
                                        {getStatusLabel(network.status)}
                                    </small>
                                </div>

                                <div className="blockchain-card__main">
                                    <span>{t('blockchainExplorer.latestBlock')}</span>
                                    <strong>{network.blockNumber ?? '-'}</strong>
                                </div>

                                <div className="blockchain-card__stats">
                                    <div>
                                        <span>{t('blockchainExplorer.chain')}</span>
                                        <strong>{network.chainId ?? '-'}</strong>
                                    </div>

                                    <div>
                                        <span>{t('blockchainExplorer.gas')}</span>
                                        <strong>{network.gasPrice ?? '-'}</strong>
                                    </div>

                                    <div>
                                        <span>{t('blockchainExplorer.max')}</span>
                                        <strong>{network.maxFee ?? '-'}</strong>
                                    </div>

                                    <div>
                                        <span>{t('blockchainExplorer.priority')}</span>
                                        <strong>{network.priorityFee ?? '-'}</strong>
                                    </div>
                                </div>

                                <small className="blockchain-card__unit">
                                    {t('blockchainExplorer.unit')}
                                </small>

                                <a
                                    href={network.explorer}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="blockchain-card__link"
                                >
                                    {t('blockchainExplorer.openExplorer')} <FiExternalLink/>
                                </a>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BlockchainExplorer