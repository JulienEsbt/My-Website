import React from 'react'
import {motion} from 'framer-motion'
import './ReflexionStats.css'

const ReflexionStats = ({items}) => {
    return (
        <section className="reflexion-stats-section">
            <div className="container reflexion-stats">
                {items.map((item, index) => (
                    <motion.article
                        key={item.label}
                        className="reflexion-stat"
                        initial={{opacity: 0, y: 28}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.45, delay: index * 0.08}}
                    >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default ReflexionStats