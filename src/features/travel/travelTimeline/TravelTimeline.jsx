import React from 'react'
import {motion} from 'framer-motion'
import trips from '../../../data/travel/trips.js'
import './TravelTimeline.css'

const TravelTimeline = () => {
    const sortedTrips = [...trips].sort((a, b) => a.year - b.year)

    return (
        <section id="stories" className="travel-timeline-section">
            <h5>My journey</h5>
            <h2>Travel Timeline</h2>

            <div className="container travel-timeline">
                <div className="travel-timeline__line"/>

                {sortedTrips.map((trip, index) => (
                    <motion.article
                        key={trip.id}
                        className="travel-timeline__item"
                        initial={{opacity: 0, y: 35}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.45, delay: index * 0.08}}
                    >
                        <div className="travel-timeline__image">
                            <img src={trip.image} alt={`${trip.city}, ${trip.country}`}/>
                        </div>

                        <div>
                            <span className="travel-timeline__year">{trip.year}</span>
                            <h3>{trip.city}</h3>
                            <small>{trip.type}</small>
                            <p>{trip.description}</p>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default TravelTimeline