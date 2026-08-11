import React from 'react'
import ReflectionCard from '../reflectionCard/ReflectionCard.jsx'
import './ReflectionList.css'

const ReflectionList = ({
    reflexions,
    language,
    categoryLabels,
    readLabel,
    featuredLabel,
    getReadingTimeLabel,
    emptyTitle,
    emptyText,
    kicker,
    title,
}) => {
    return (
        <section id="latest">
            <p className="section-kicker">{kicker}</p>
            <h2>{title}</h2>

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
                            featuredLabel={featuredLabel}
                            readingTimeLabel={getReadingTimeLabel(reflexion.readingTime)}
                            featured={reflexion.featured}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default ReflectionList
