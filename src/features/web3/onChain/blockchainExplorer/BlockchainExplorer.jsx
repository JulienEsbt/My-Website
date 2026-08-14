import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import {motion} from 'framer-motion'
import {
    FiChevronLeft,
    FiChevronRight,
    FiExternalLink,
    FiPause,
    FiPlay,
    FiRefreshCw,
} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {BLOCKCHAIN_NETWORKS} from '../../../../config/blockchains.js'
import useReducedMotion from '../../../../components/common/accessibility/useReducedMotion.js'
import {formatNumber} from '../../../../i18n/formatters.js'
import {fetchBlockchainStatuses} from '../../../../services/web3/blockchainStatusService.js'
import './BlockchainExplorer.css'

const BlockchainExplorer = () => {
    const {t, i18n} = useTranslation('web3')
    const language = i18n.resolvedLanguage ?? i18n.language

    const [networks, setNetworks] = useState(() =>
        BLOCKCHAIN_NETWORKS.map((network) => ({...network, status: 'idle'}))
    )
    const [loading, setLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [autoScrollPaused, setAutoScrollPaused] = useState(false)
    const requestIdRef = useRef(0)
    const abortControllerRef = useRef(null)
    const reducedMotion = useReducedMotion()

    const autoScrollPlugin = useMemo(
        () =>
            reducedMotion
                ? null
                : AutoScroll({
                      speed: 0.7,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                  }),
        [reducedMotion]
    )

    const carouselPlugins = useMemo(
        () => (autoScrollPlugin ? [autoScrollPlugin] : []),
        [autoScrollPlugin]
    )

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: !reducedMotion,
            align: 'start',
            dragFree: true,
            containScroll: reducedMotion ? 'trimSnaps' : false,
        },
        carouselPlugins
    )

    const getStatusLabel = (status) => {
        if (status === 'online') return t('blockchainExplorer.status.online')
        if (status === 'missing-rpc') return t('blockchainExplorer.status.missingRpc')
        if (status === 'idle') return t('blockchainExplorer.status.idle')
        return t('blockchainExplorer.status.error')
    }

    const loadNetworks = useCallback(async () => {
        const requestId = ++requestIdRef.current
        abortControllerRef.current?.abort()
        const controller = new AbortController()
        abortControllerRef.current = controller
        setLoading(true)

        let results
        try {
            const statuses = await fetchBlockchainStatuses({signal: controller.signal})
            const statusById = new Map(statuses.map((network) => [network.id, network]))
            results = BLOCKCHAIN_NETWORKS.map((network) => ({
                ...network,
                ...(statusById.get(network.id) ?? {status: 'error'}),
            }))
        } catch {
            if (controller.signal.aborted) return
            results = BLOCKCHAIN_NETWORKS.map((network) => ({...network, status: 'error'}))
        }

        if (requestId === requestIdRef.current) {
            setNetworks(results)
            setLoading(false)
            setHasLoaded(true)
        }
    }, [])

    const carouselNetworks = reducedMotion
        ? networks
        : Array.from({length: 4}).flatMap(() => networks)

    useEffect(() => {
        loadNetworks()

        return () => {
            abortControllerRef.current?.abort()
            requestIdRef.current += 1
        }
    }, [loadNetworks])

    useEffect(() => {
        const plugins = typeof emblaApi?.plugins === 'function' ? emblaApi.plugins() : null
        const autoScroll = plugins?.autoScroll
        if (!autoScroll) return

        if (autoScrollPaused) autoScroll.stop()
        else autoScroll.play()
    }, [autoScrollPaused, emblaApi])

    return (
        <section id="blockchain-explorer" className="blockchain-section" aria-busy={loading}>
            <p className="section-kicker">{t('blockchainExplorer.kicker')}</p>
            <h2>{t('blockchainExplorer.title')}</h2>

            <div className="container blockchain-explorer__top">
                <p>{t('blockchainExplorer.description')}</p>

                <button type="button" className="btn" onClick={loadNetworks} disabled={loading}>
                    <FiRefreshCw aria-hidden="true" />
                    {loading ? t('blockchainExplorer.refreshing') : t('blockchainExplorer.refresh')}
                </button>
            </div>

            <p className="sr-only" role="status">
                {loading
                    ? t('blockchainExplorer.refreshing')
                    : hasLoaded
                      ? t('blockchainExplorer.updated')
                      : ''}
            </p>

            <div className="container blockchain-embla">
                <div
                    className="blockchain-embla__viewport"
                    ref={emblaRef}
                    role="region"
                    aria-label={t('blockchainExplorer.carouselAria')}
                >
                    <div className="blockchain-embla__container">
                        {carouselNetworks.map((network, index) => {
                            const isDuplicate = !reducedMotion && index >= networks.length

                            return (
                                <motion.article
                                    key={`${network.id}-${index}`}
                                    className="blockchain-card"
                                    initial={{opacity: 0, y: 24}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true}}
                                    transition={{duration: 0.4, delay: index * 0.05}}
                                    aria-hidden={isDuplicate ? 'true' : undefined}
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
                                        <strong>
                                            {network.blockNumber == null
                                                ? '-'
                                                : formatNumber(network.blockNumber, language)}
                                        </strong>
                                    </div>

                                    <div className="blockchain-card__stats">
                                        <div>
                                            <span>{t('blockchainExplorer.chain')}</span>
                                            <strong>{network.chainId ?? '-'}</strong>
                                        </div>

                                        <div>
                                            <span>{t('blockchainExplorer.gas')}</span>
                                            <strong>
                                                {network.gasPrice == null
                                                    ? '-'
                                                    : formatNumber(network.gasPrice, language, {
                                                          maximumFractionDigits: 2,
                                                      })}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>{t('blockchainExplorer.max')}</span>
                                            <strong>
                                                {network.maxFee == null
                                                    ? '-'
                                                    : formatNumber(network.maxFee, language, {
                                                          maximumFractionDigits: 2,
                                                      })}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>{t('blockchainExplorer.priority')}</span>
                                            <strong>
                                                {network.priorityFee == null
                                                    ? '-'
                                                    : formatNumber(network.priorityFee, language, {
                                                          maximumFractionDigits: 2,
                                                      })}
                                            </strong>
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
                                        tabIndex={isDuplicate ? -1 : undefined}
                                    >
                                        {t('blockchainExplorer.openExplorer')}{' '}
                                        <FiExternalLink aria-hidden="true" />
                                    </a>
                                </motion.article>
                            )
                        })}
                    </div>
                </div>

                <div className="blockchain-embla__controls">
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollPrev()}
                        aria-label={t('blockchainExplorer.previous')}
                    >
                        <FiChevronLeft aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollNext()}
                        aria-label={t('blockchainExplorer.next')}
                    >
                        <FiChevronRight aria-hidden="true" />
                    </button>
                    {!reducedMotion && (
                        <button
                            type="button"
                            onClick={() => setAutoScrollPaused((paused) => !paused)}
                            aria-label={
                                autoScrollPaused
                                    ? t('blockchainExplorer.resume')
                                    : t('blockchainExplorer.pause')
                            }
                        >
                            {autoScrollPaused ? <FiPlay /> : <FiPause />}
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BlockchainExplorer
