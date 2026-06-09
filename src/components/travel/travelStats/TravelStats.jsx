import React from 'react'
import {motion} from 'framer-motion'
import trips from '../../../data/travel/trips'
import './TravelStats.css'

const TravelStats = () => {
    const countries = new Set(trips.map((trip) => trip.country)).size
    const cities = trips.length

    const stats = [
        {label: 'Pays visités', value: countries},
        {label: 'Villes', value: cities},
        {label: 'Souvenirs', value: '∞'},
        {label: 'Prochaine envie', value: 'Népal'},
    ]

    return (
        <section className="travel-stats-section">
            <div className="container travel-stats">
                {stats.map((stat, index) => (
                    <motion.article
                        key={stat.label}
                        className="travel-stat"
                        initial={{opacity: 0, y: 28}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.45, delay: index * 0.08}}
                    >
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default TravelStats