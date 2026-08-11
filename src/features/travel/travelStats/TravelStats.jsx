import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import trips from '../../../data/travel/trips.js'
import './TravelStats.css'

const TravelStats = () => {
    const {t} = useTranslation('travel')

    const completedTrips = trips.filter((trip) => !trip.isPlanned)

    const visitedCountries = new Set(
        completedTrips.filter((trip) => trip.isSovereignCountry).map((trip) => trip.countryCode)
    ).size

    const destinations = completedTrips.length

    const livedPlaces = completedTrips.filter((trip) => trip.hasLivedThere).length

    const studyWorkExperiences = completedTrips.filter(
        (trip) => trip.isStudyTrip || trip.isWorkTrip
    ).length

    const stats = [
        {
            label: t('stats.countries'),
            value: visitedCountries,
        },
        {
            label: t('stats.destinations'),
            value: destinations,
        },
        {
            label: t('stats.lived'),
            value: livedPlaces,
        },
        {
            label: t('stats.studyWork'),
            value: studyWorkExperiences,
        },
    ]

    return (
        <div id="travel-stats" className="travel-stats-section">
            <div className="container travel-stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="travel-stat"
                        initial={{opacity: 0, y: 28}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{
                            duration: 0.45,
                            delay: index * 0.08,
                        }}
                    >
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default TravelStats
