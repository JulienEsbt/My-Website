import React, {lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiChevronRight, FiExternalLink, FiMapPin, FiBookOpen, FiArrowLeft} from 'react-icons/fi'
import useFocusTrap from '../../../components/common/accessibility/useFocusTrap.js'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'
import useImmersiveNavigation from '../../../components/common/accessibility/useImmersiveNavigation.js'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import {getPreferredScrollBehavior} from '../../../components/common/accessibility/motionPreferences.js'
import FeatureLoading from '../../../components/common/feedback/featureLoading/FeatureLoading.jsx'
import CountryFlag from '../../../components/common/media/CountryFlag.jsx'
import trips from '../../../data/travel/trips.js'
import {getStaticTravelMapUrl} from '../../../services/mapbox/mapboxStaticService.js'
import './TravelTimeline.css'

const TravelGallery = lazy(() => import('../travelGallery/TravelGallery.jsx'))

const TravelTimeline = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    const sortedTrips = useMemo(() => [...trips].sort((a, b) => a.sortOrder - b.sortOrder), [])

    const [activeTripId, setActiveTripId] = useState(sortedTrips[0]?.id)
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
    const activeTrip = sortedTrips.find((trip) => trip.id === activeTripId) ?? sortedTrips[0]
    const [detailAnimationKey, setDetailAnimationKey] = useState(0)
    const [isClosingDetail, setIsClosingDetail] = useState(false)
    const closeDetailTimerRef = useRef(null)
    const detailScrollRef = useRef(null)
    const [canScrollDetail, setCanScrollDetail] = useState(false)
    const [isDetailBottom, setIsDetailBottom] = useState(false)
    const isMobileDetail = useMediaQuery(
        '(max-width: 700px), (max-height: 500px) and (max-width: 950px)'
    )
    const detailDialogRef = useRef(null)
    const detailBackRef = useRef(null)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)
    const hasOpenedGalleryRef = useRef(false)
    const isDetailUnavailable = isGalleryOpen || (isMobileDetail && !mobileDetailOpen)

    const handleGalleryOpenChange = useCallback((isOpen) => {
        hasOpenedGalleryRef.current ||= isOpen
        setIsGalleryOpen(isOpen)
    }, [])

    useEffect(
        () => () => {
            clearTimeout(closeDetailTimerRef.current)
        },
        []
    )

    const getTripText = (trip, field) => {
        if (!trip) return ''

        if (!isFr) {
            return trip[`${field}En`] ?? trip[field]
        }

        return trip[field]
    }

    const closeMobileDetail = () => {
        setIsClosingDetail(true)

        clearTimeout(closeDetailTimerRef.current)
        closeDetailTimerRef.current = setTimeout(() => {
            setMobileDetailOpen(false)
            setIsClosingDetail(false)
        }, 220)
    }

    const miniMapUrl = getStaticTravelMapUrl(activeTrip)

    useFocusTrap({
        active: isMobileDetail && mobileDetailOpen && !isGalleryOpen,
        autoFocus: !hasOpenedGalleryRef.current,
        containerRef: detailDialogRef,
        initialFocusRef: detailBackRef,
        onDismiss: closeMobileDetail,
    })

    useBodyScrollLock(isMobileDetail && mobileDetailOpen)
    useImmersiveNavigation(isMobileDetail && mobileDetailOpen)

    const updateDetailScrollState = () => {
        const el = detailScrollRef.current
        if (!el) return

        const canScroll = el.scrollHeight > el.clientHeight + 4
        const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8

        setCanScrollDetail(canScroll)
        setIsDetailBottom(isBottom)
    }

    useEffect(() => {
        requestAnimationFrame(updateDetailScrollState)
    }, [activeTripId, isFr])

    return (
        <section id="stories" className="travel-timeline-section">
            <p className="section-kicker">{t('timeline.kicker')}</p>
            <h2>{t('timeline.title')}</h2>

            <div className="container travel-timeline">
                <div className="travel-timeline__list">
                    <div className="travel-timeline__rail" />

                    {sortedTrips.map((trip, index) => (
                        <motion.button
                            type="button"
                            key={trip.id}
                            className={`travel-timeline__item ${activeTripId === trip.id ? 'active' : ''}`}
                            onClick={() => {
                                hasOpenedGalleryRef.current = false
                                setIsGalleryOpen(false)
                                setActiveTripId(trip.id)
                                setMobileDetailOpen(true)
                                setDetailAnimationKey((key) => key + 1)
                            }}
                            initial={{opacity: 0, y: 24}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.35, delay: index * 0.035}}
                            aria-pressed={activeTripId === trip.id}
                        >
                            <span className="travel-timeline__dot" />

                            <span className="travel-timeline__main">
                                <span className="travel-timeline__flag" aria-hidden="true">
                                    <CountryFlag code={trip.countryCode} />
                                </span>

                                <span>
                                    <strong>{getTripText(trip, 'city')}</strong>
                                    <small>{getTripText(trip, 'country')}</small>
                                </span>
                            </span>

                            <span className="travel-timeline__meta">
                                <span>{getTripText(trip, 'dateLabel')}</span>
                                <em className={`travel-timeline__type ${trip.category}`}>
                                    {getTripText(trip, 'type')}
                                </em>
                            </span>

                            <FiChevronRight className="travel-timeline__arrow" />
                        </motion.button>
                    ))}
                </div>

                {activeTrip && (
                    <motion.aside
                        ref={detailDialogRef}
                        key={`${activeTrip.id}-${detailAnimationKey}`}
                        className={`travel-timeline__detail ${mobileDetailOpen ? 'mobile-open' : ''} ${isClosingDetail ? 'closing' : ''}`}
                        initial={{opacity: 0, x: 24}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.35}}
                        role={
                            isMobileDetail && mobileDetailOpen && !isGalleryOpen
                                ? 'dialog'
                                : undefined
                        }
                        aria-modal={
                            isMobileDetail && mobileDetailOpen && !isGalleryOpen
                                ? 'true'
                                : undefined
                        }
                        aria-hidden={isDetailUnavailable ? 'true' : undefined}
                        inert={isDetailUnavailable ? '' : undefined}
                        aria-labelledby="travel-detail-title"
                        tabIndex={isMobileDetail && mobileDetailOpen ? -1 : undefined}
                    >
                        <button
                            ref={detailBackRef}
                            type="button"
                            className="travel-timeline__back"
                            onClick={closeMobileDetail}
                        >
                            <FiArrowLeft />
                            {t('timeline.details.back')}
                        </button>
                        <div className="travel-timeline__detail-header">
                            <span className="travel-timeline__detail-flag" aria-hidden="true">
                                <CountryFlag code={activeTrip.countryCode} />
                            </span>

                            <div>
                                <h3 id="travel-detail-title">{getTripText(activeTrip, 'city')}</h3>
                                <p>{getTripText(activeTrip, 'country')}</p>
                            </div>
                        </div>

                        <div className="travel-timeline__detail-badges">
                            <span>{getTripText(activeTrip, 'dateLabel')}</span>
                            <span className={`travel-timeline__type ${activeTrip.category}`}>
                                {getTripText(activeTrip, 'type')}
                            </span>

                            {activeTrip.hasLivedThere && <span>{t('timeline.badges.lived')}</span>}
                            {activeTrip.isStudyTrip && <span>{t('timeline.badges.study')}</span>}
                            {activeTrip.isWorkTrip && <span>{t('timeline.badges.work')}</span>}
                            {activeTrip.isPlanned && <span>{t('timeline.badges.planned')}</span>}
                        </div>

                        <div
                            ref={detailScrollRef}
                            className="travel-timeline__detail-scroll"
                            onScroll={updateDetailScrollState}
                        >
                            <p className="travel-timeline__detail-description">
                                {getTripText(activeTrip, 'description')}
                            </p>

                            {activeTrip.photoAlbumId && (
                                <Suspense fallback={<FeatureLoading />}>
                                    <TravelGallery
                                        key={activeTrip.photoAlbumId}
                                        albumId={activeTrip.photoAlbumId}
                                        city={getTripText(activeTrip, 'city')}
                                        onOpenChange={handleGalleryOpenChange}
                                    />
                                </Suspense>
                            )}

                            <div className="travel-timeline__detail-section">
                                <h4>
                                    <FiBookOpen />
                                    {t('timeline.details.story')}
                                </h4>

                                <p>
                                    {getTripText(activeTrip, 'story') ||
                                        t('timeline.details.noStory')}
                                </p>
                            </div>

                            <div className="travel-timeline__detail-section">
                                <h4>
                                    <FiMapPin />
                                    {t('timeline.details.location')}
                                </h4>

                                <a
                                    className={`travel-timeline__mini-map ${!miniMapUrl ? 'no-map' : ''}`}
                                    href={`https://www.google.com/maps?q=${activeTrip.lat},${activeTrip.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={
                                        miniMapUrl
                                            ? {
                                                  backgroundImage: `linear-gradient(rgba(5, 12, 34, 0.18), rgba(5, 12, 34, 0.45)), url("${miniMapUrl}")`,
                                              }
                                            : undefined
                                    }
                                >
                                    <span>{getTripText(activeTrip, 'city')}</span>
                                </a>
                            </div>

                            {activeTrip.polarstepsUrl && (
                                <a
                                    href={activeTrip.polarstepsUrl}
                                    className="travel-timeline__external"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('timeline.details.polarsteps')}
                                    <FiExternalLink />
                                </a>
                            )}
                        </div>

                        {canScrollDetail && !isDetailBottom && (
                            <button
                                type="button"
                                className="travel-timeline__scroll-cue"
                                onClick={() => {
                                    detailScrollRef.current?.scrollTo({
                                        top: detailScrollRef.current.scrollHeight,
                                        behavior: getPreferredScrollBehavior(),
                                    })
                                }}
                                aria-label={t('timeline.details.scroll')}
                            >
                                ↓
                            </button>
                        )}
                    </motion.aside>
                )}
            </div>
        </section>
    )
}

export default TravelTimeline
