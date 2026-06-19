import React, {useMemo, useRef, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import './DreamDestinations.css'

const DreamDestinations = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')
    const [activeIndex, setActiveIndex] = useState(0)

    const railRef = useRef(null)

    const syncRail = (index) => {
        requestAnimationFrame(() => {
            const item = railRef.current?.children?.[index]
            item?.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            })
        })
    }

    const activeDestination = dreamDestinations[activeIndex]

    const getText = (destination, field) => {
        if (!destination) return ''
        return isFr ? destination[field] : destination[`${field}En`] ?? destination[field]
    }

    const next = () => {
        setActiveIndex((index) => {
            const newIndex = (index + 1) % dreamDestinations.length
            syncRail(newIndex)
            return newIndex
        })
    }

    const previous = () => {
        setActiveIndex((index) => {
            const newIndex = index === 0 ? dreamDestinations.length - 1 : index - 1
            syncRail(newIndex)
            return newIndex
        })
    }

    const activeProgress = useMemo(
        () => `${activeIndex + 1} / ${dreamDestinations.length}`,
        [activeIndex]
    )

    return (
        <section id="dreams" className="dream-section">
            <h5>{t('dreams.kicker')}</h5>
            <h2>{t('dreams.title')}</h2>
            <p className="dream-section__intro">{t('dreams.intro')}</p>

            <div className="container dream-showcase">
                <div ref={railRef} className="dream-showcase__rail" aria-label="Destinations rêvées">
                    {dreamDestinations.map((destination, index) => (
                        <button
                            key={destination.id}
                            type="button"
                            className={`dream-showcase__thumb ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => {
                                setActiveIndex(index)
                                syncRail(index)
                            }}
                        >
                            <span>{destination.emoji}</span>
                            <strong>{getText(destination, 'name')}</strong>
                            <small>{getText(destination, 'label')}</small>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.article
                        key={activeDestination.id}
                        className="dream-showcase__card"
                        initial={{opacity: 0, y: 24, scale: 0.98}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -18, scale: 0.98}}
                        transition={{duration: 0.35, ease: 'easeOut'}}
                    >
                        <div className="dream-showcase__top">
                            <span className="dream-showcase__emoji">
                                {activeDestination.emoji}
                            </span>

                            <span className="dream-showcase__counter">
                                {activeProgress}
                            </span>
                        </div>

                        <div className="dream-showcase__tags">
                            <span>{getText(activeDestination, 'category')}</span>
                            <span>{getText(activeDestination, 'label')}</span>
                        </div>

                        <h3>{getText(activeDestination, 'name')}</h3>
                        <small>{getText(activeDestination, 'country')}</small>

                        <p className="dream-showcase__short">
                            {getText(activeDestination, 'short')}
                        </p>

                        <p className="dream-showcase__reason">
                            {getText(activeDestination, 'reason')}
                        </p>

                        <div className="dream-showcase__controls">
                            <button type="button" onClick={previous} aria-label="Destination précédente">
                                <FiArrowLeft/>
                            </button>

                            <div className="dream-showcase__dots">
                                {dreamDestinations.map((destination, index) => (
                                    <button
                                        key={destination.id}
                                        type="button"
                                        className={activeIndex === index ? 'active' : ''}
                                        onClick={() => {
                                            setActiveIndex(index)
                                            syncRail(index)
                                        }}
                                        aria-label={`Destination ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button type="button" onClick={next} aria-label="Destination suivante">
                                <FiArrowRight/>
                            </button>
                        </div>
                    </motion.article>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default DreamDestinations