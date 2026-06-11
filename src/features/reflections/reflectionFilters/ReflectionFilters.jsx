import React from 'react'
import './ReflectionFilters.css'

const ReflectionFilters = ({filters, activeFilter, onFilterChange}) => {
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

export default ReflectionFilters