import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'
import './ReflectionStats.css'

const ReflectionStats = ({items}) => {
    const reducedMotion = useReducedMotion()
    return (
        <div className="reflexion-stats-section">
            <div className="container reflexion-stats">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id ?? index}
                        className="reflexion-stat"
                        initial={reducedMotion ? false : {opacity: 0, y: 28}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.45, delay: index * 0.08}}
                    >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default ReflectionStats
