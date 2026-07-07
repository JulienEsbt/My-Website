import React, {useEffect, useMemo, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiChevronRight, FiExternalLink, FiMapPin, FiBookOpen, FiArrowLeft} from 'react-icons/fi'
import trips from '../../../data/travel/trips.js'
import './TravelTimeline.css'

const TravelTimeline = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    const sortedTrips = useMemo(
        () => [...trips].sort((a, b) => a.sortOrder - b.sortOrder),
        []
    )

    const [activeTripId, setActiveTripId] = useState(sortedTrips[0]?.id)
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
    const activeTrip = sortedTrips.find((trip) => trip.id === activeTripId) ?? sortedTrips[0]
    const [detailAnimationKey, setDetailAnimationKey] = useState(0)
    const [isClosingDetail, setIsClosingDetail] = useState(false)

    const getTripText = (trip, field) => {
        if (!trip) return ''

        if (!isFr) {
            return trip[`${field}En`] ?? trip[field]
        }

        return trip[field]
    }

    const closeMobileDetail = () => {
        setIsClosingDetail(true)

        setTimeout(() => {
            setMobileDetailOpen(false)
            setIsClosingDetail(false)
        }, 220)
    }

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

    const miniMapUrl = mapboxToken && activeTrip
        ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/pin-s+4db5ff(${activeTrip.lng},${activeTrip.lat})/${activeTrip.lng},${activeTrip.lat},4,0/600x260@2x?access_token=${mapboxToken}`
        : null

    const tripPhotos = activeTrip?.photos ?? []
    const [activePhotoIndex, setActivePhotoIndex] = useState(null)
    const lightboxStripRef = useRef(null)

    const openPhoto = (index) => setActivePhotoIndex(index)
    const closePhoto = () => setActivePhotoIndex(null)

    const previousPhoto = () => {
        setActivePhotoIndex((index) =>
            index === 0 ? tripPhotos.length - 1 : index - 1
        )
    }

    const nextPhoto = () => {
        setActivePhotoIndex((index) =>
            index === tripPhotos.length - 1 ? 0 : index + 1
        )
    }

    useEffect(() => {
        if (activePhotoIndex == null) return

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                closePhoto()
                return
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                previousPhoto()
                return
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault()
                nextPhoto()
                return
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [activePhotoIndex, tripPhotos.length])

    useEffect(() => {
        if (activePhotoIndex === null) return

        const scrollY = window.scrollY

        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.width = '100%'

        const preventPageScroll = (event) => {
            const strip = lightboxStripRef.current
            if (strip && strip.contains(event.target)) return
            event.preventDefault()
        }

        window.addEventListener('wheel', preventPageScroll, {passive: false})
        window.addEventListener('touchmove', preventPageScroll, {passive: false})

        return () => {
            window.removeEventListener('wheel', preventPageScroll)
            window.removeEventListener('touchmove', preventPageScroll)

            document.documentElement.style.overflow = ''
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.left = ''
            document.body.style.right = ''
            document.body.style.width = ''

            window.scrollTo({
                top: scrollY,
                left: 0,
                behavior: 'instant',
            })
        }
    }, [activePhotoIndex])

    useEffect(() => {
        if (activePhotoIndex === null) return

        const activeThumb = lightboxStripRef.current?.children?.[activePhotoIndex]

        activeThumb?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        })
    }, [activePhotoIndex])

    useEffect(() => {
        const isOpen = activePhotoIndex !== null

        const langWrapper = document.querySelector('.lang-wrapper')
        const pageNav = document.querySelector('.pagenav')
        const travelNav = document.querySelector('.travel-nav')

        ;[langWrapper, pageNav, travelNav].forEach((element) => {
            if (element) {
                element.style.display = isOpen ? 'none' : ''
            }
        })

        return () => {
            ;[langWrapper, pageNav, travelNav].forEach((element) => {
                if (element) {
                    element.style.display = ''
                }
            })
        }
    }, [activePhotoIndex])

    return (
        <section id="stories" className="travel-timeline-section">
            <h5>{t('timeline.kicker')}</h5>
            <h2>{t('timeline.title')}</h2>

            <div className="container travel-timeline">
                <div className="travel-timeline__list">
                    <div className="travel-timeline__rail"/>

                    {sortedTrips.map((trip, index) => (
                        <motion.button
                            type="button"
                            key={trip.id}
                            className={`travel-timeline__item ${activeTripId === trip.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTripId(trip.id)
                                setMobileDetailOpen(true)
                                setDetailAnimationKey((key) => key + 1)
                            }}
                            initial={{opacity: 0, y: 24}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.35, delay: index * 0.035}}
                        >
                            <span className="travel-timeline__dot"/>

                            <span className="travel-timeline__main">
                                <span className="travel-timeline__flag">{trip.flag}</span>

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

                            <FiChevronRight className="travel-timeline__arrow"/>
                        </motion.button>
                    ))}
                </div>

                {activeTrip && (
                    <motion.aside
                        key={`${activeTrip.id}-${detailAnimationKey}`}
                        className={`travel-timeline__detail ${mobileDetailOpen ? 'mobile-open' : ''} ${isClosingDetail ? 'closing' : ''}`}
                        initial={{opacity: 0, x: 24}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.35}}
                    >
                        <button
                            type="button"
                            className="travel-timeline__back"
                            onClick={closeMobileDetail}
                        >
                            <FiArrowLeft/>
                            {t('timeline.details.back')}
                        </button>
                        <div className="travel-timeline__detail-header">
                            <span className="travel-timeline__detail-flag">{activeTrip.flag}</span>

                            <div>
                                <h3>{getTripText(activeTrip, 'city')}</h3>
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

                        <p className="travel-timeline__detail-description">
                            {getTripText(activeTrip, 'description')}
                        </p>

                        {tripPhotos.length > 0 && (
                            <div className="travel-timeline__photo-preview">
                                <button
                                    type="button"
                                    className="travel-timeline__photo-hero"
                                    onClick={() => openPhoto(0)}
                                >
                                    <img src={tripPhotos[0].src} alt={tripPhotos[0].alt} loading="lazy"/>
                                    <span>Voir les photos</span>
                                </button>

                                <div className="travel-timeline__photo-strip">
                                    {tripPhotos.slice(1, 4).map((photo, index) => (
                                        <button
                                            key={photo.src}
                                            type="button"
                                            className="travel-timeline__photo-thumb"
                                            onClick={() => openPhoto(index + 1)}
                                        >
                                            <img src={photo.src} alt={photo.alt} loading="lazy"/>
                                        </button>
                                    ))}
                                </div>

                                {tripPhotos.length > 4 && (
                                    <button
                                        type="button"
                                        className="travel-timeline__photo-more-wide"
                                        onClick={() => openPhoto(0)}
                                    >
                                        Ouvrir la galerie complète · {tripPhotos.length} photos
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="travel-timeline__detail-section">
                            <h4>
                                <FiBookOpen/>
                                {t('timeline.details.story')}
                            </h4>

                            <p>
                                {getTripText(activeTrip, 'story') || t('timeline.details.noStory')}
                            </p>
                        </div>

                        <div className="travel-timeline__detail-section">
                            <h4>
                                <FiMapPin/>
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
                                <FiExternalLink/>
                            </a>
                        )}

                        {activePhotoIndex !== null && (
                            <div
                                className="travel-timeline__lightbox"
                                onClick={closePhoto}
                            >
                                <button
                                    type="button"
                                    className="travel-timeline__lightbox-close"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        closePhoto()
                                    }}
                                    aria-label="Fermer la galerie"
                                >
                                    ×
                                </button>

                                <button
                                    type="button"
                                    className="travel-timeline__lightbox-nav previous"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        previousPhoto()
                                    }}
                                    aria-label="Photo précédente"
                                >
                                    ←
                                </button>

                                <div
                                    className="travel-timeline__lightbox-content"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="travel-timeline__lightbox-image-frame">
                                        <img
                                            src={tripPhotos[activePhotoIndex].src}
                                            alt={tripPhotos[activePhotoIndex].alt}
                                        />

                                        <span className="travel-timeline__lightbox-counter">
                    {activePhotoIndex + 1} / {tripPhotos.length}
                </span>
                                    </div>

                                    <div className="travel-timeline__lightbox-dock">
                                        <div
                                            ref={lightboxStripRef}
                                            className="travel-timeline__lightbox-strip"
                                            onWheel={(event) => {
                                                event.stopPropagation()
                                                event.preventDefault()
                                                event.currentTarget.scrollLeft += event.deltaY
                                            }}
                                        >
                                            {tripPhotos.map((photo, index) => (
                                                <button
                                                    key={`${photo.src}-lightbox-${index}`}
                                                    type="button"
                                                    className={activePhotoIndex === index ? 'active' : ''}
                                                    onClick={() => setActivePhotoIndex(index)}
                                                    aria-label={`Voir la photo ${index + 1}`}
                                                >
                                                    <img src={photo.src} alt={photo.alt}/>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="travel-timeline__lightbox-nav next"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        nextPhoto()
                                    }}
                                    aria-label="Photo suivante"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </motion.aside>
                )}
            </div>
        </section>
    )
}

export default TravelTimeline