import React from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import './ReflectionCard.css'

const formatDate = (date, language) => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date))
}

const ReflectionCard = ({
                            reflexion,
                            language,
                            index,
                            categoryLabels,
                            readLabel,
                            featured,
                        }) => {
    return (
        <motion.article
            className={`reflexion-card ${featured ? 'featured' : ''}`}
            initial={{opacity: 0, y: 35}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.45, delay: index * 0.08}}
        >
            <div className="reflexion-card__top">
                <span className="reflexion-card__category">
                    {categoryLabels?.[reflexion.category] ?? reflexion.category}
                </span>

                {featured && (
                    <span className="reflexion-card__featured">
                        À lire
                    </span>
                )}

                <span className="reflexion-card__date">
                    {formatDate(reflexion.date, language)}
                </span>
            </div>

            <h3>{reflexion.title[language]}</h3>

            <p>{reflexion.excerpt[language]}</p>

            <div className="reflexion-card__footer">
                <span>{reflexion.readingTime} min</span>

                <Link to={`/reflections/${reflexion.slug}`} className="btn reflexion-card__button">
                    {readLabel} →
                </Link>
            </div>
        </motion.article>
    )
}

export default ReflectionCard