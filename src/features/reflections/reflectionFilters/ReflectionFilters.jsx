import React from 'react'
import './ReflectionFilters.css'
import {motion} from 'framer-motion'

const ReflectionFilters = ({filters, activeFilter, onFilterChange}) => {
    return (
        <div className="container reflexion-filters">
            {filters.map((filter) => (
                <motion.button
                    key={filter.value}
                    className={`reflexion-filter ${activeFilter === filter.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter.value)}
                    initial={{opacity: 0, y: 14}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.35, delay: 0.04 * filters.indexOf(filter)}}
                >
                    {filter.label}
                </motion.button>
            ))}
        </div>
    )
}

export default ReflectionFilters