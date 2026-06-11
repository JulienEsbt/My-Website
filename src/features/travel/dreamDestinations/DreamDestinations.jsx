import React from 'react'
import {motion} from 'framer-motion'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import './DreamDestinations.css'

const DreamDestinations = () => {
    return (
        <section>
            <h5>Next horizons</h5>
            <h2>Dream Destinations</h2>

            <div className="container dream-destinations">
                {dreamDestinations.map((destination, index) => (
                    <motion.article
                        key={destination.id}
                        className="dream-card"
                        initial={{opacity: 0, y: 35}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.45, delay: index * 0.08}}
                    >
                        <span className="dream-card__emoji">{destination.emoji}</span>
                        <h3>{destination.name}</h3>
                        <small>{destination.country}</small>
                        <p>{destination.reason}</p>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default DreamDestinations