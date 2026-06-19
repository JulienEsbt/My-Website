import React, {useMemo, useState} from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiChevronRight, FiExternalLink, FiMapPin, FiBookOpen, FiArrowLeft} from 'react-icons/fi'
import trips from '../../../data/travel/trips.js'
import './TravelTimeline.css'

const TravelTimeline = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    const sortedTrips = useMemo(
        () => [...trips].sort((a, b) => a.year - b.year),
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
                    </motion.aside>
                )}
            </div>
        </section>
    )
}

export default TravelTimeline