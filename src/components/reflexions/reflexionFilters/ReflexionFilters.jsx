import React from 'react'
import './ReflexionFilters.css'

const ReflexionFilters = ({filters, activeFilter, onFilterChange}) => {
    return (
        <div className="container reflexion-filters">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    className={`reflexion-filter ${activeFilter === filter.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}

export default ReflexionFilters