import React from 'react'
import ReflectionCard from '../reflectionCard/ReflectionCard.jsx'
import './ReflectionList.css'

const ReflectionList = ({
                            reflexions,
                            language,
                            categoryLabels,
                            readLabel,
                            emptyTitle,
                            emptyText,
                        }) => {
    return (
        <section id="latest">
            <h5>Personal notebook</h5>
            <h2>Latest Reflexions</h2>

            {reflexions.length === 0 ? (
                <div className="container reflexion-empty">
                    <h3>{emptyTitle}</h3>
                    <p>{emptyText}</p>
                </div>
            ) : (
                <div className="container reflexion-list">
                    {reflexions.map((reflexion, index) => (
                        <ReflectionCard
                            key={reflexion.id}
                            reflexion={reflexion}
                            language={language}
                            index={index}
                            categoryLabels={categoryLabels}
                            readLabel={readLabel}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default ReflectionList