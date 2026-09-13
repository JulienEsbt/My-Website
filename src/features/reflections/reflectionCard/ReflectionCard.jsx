import React from 'react'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import {motion} from 'framer-motion'
import {formatDate} from '../../../i18n/formatters.js'
import './ReflectionCard.css'

const ReflectionCard = ({
    reflexion,
    language,
    index,
    categoryLabels,
    readLabel,
    featuredLabel,
    readingTimeLabel,
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
            <Link
                to={`/reflections/${reflexion.slug}`}
                className="reflexion-card__link"
                aria-label={`${readLabel} · ${reflexion.title[language]}`}
            >
                <div className="reflexion-card__top">
                    <span className="reflexion-card__category">
                        {categoryLabels?.[reflexion.category] ?? reflexion.category}
                    </span>

                    {featured && <span className="reflexion-card__featured">{featuredLabel}</span>}

                    <span className="reflexion-card__date">
                        {formatDate(reflexion.date, language)}
                    </span>
                </div>

                <h3>{reflexion.title[language]}</h3>

                <p>{reflexion.excerpt[language]}</p>

                <div className="reflexion-card__footer">
                    <span>{readingTimeLabel}</span>

                    <span className="btn reflexion-card__button">{readLabel} →</span>
                </div>
            </Link>
        </motion.article>
    )
}

export default ReflectionCard
