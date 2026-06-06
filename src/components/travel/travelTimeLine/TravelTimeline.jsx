import React from 'react'
import {motion} from 'framer-motion'
import trips from '../../../data/travel/trips'
import './TravelTimeline.css'

const TravelTimeline = () => {
    return (
        <section id="stories">
            <h5>My journey</h5>
            <h2>Travel Timeline</h2>

            <div className="container timeline__container">
                {trips.map((trip, index) => (
                    <motion.article
                        key={trip.id}
                        className="timeline__item"
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                        }}
                    >
                        <h3>
                            {trip.city}, {trip.country}
                        </h3>

                        <small>{trip.year}</small>

                        <p>{trip.description}</p>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default TravelTimeline