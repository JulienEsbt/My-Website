import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiArrowLeft, FiArrowRight, FiPause, FiPlay} from 'react-icons/fi'
import {getPreferredScrollBehavior} from '../../../components/common/accessibility/motionPreferences.js'
import CountryFlag from '../../../components/common/media/CountryFlag.jsx'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import './DreamDestinations.css'

const DreamDestinations = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')
    const [activeIndex, setActiveIndex] = useState(0)

    const railRef = useRef(null)
    const sectionRef = useRef(null)
    const [paused, setPaused] = useState(false)
    const [visible, setVisible] = useState(false)
    const reducedMotion = useReducedMotion()
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.25,
        })
        observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])
    useEffect(() => {
        if (paused || !visible || reducedMotion) return
        const timer = setInterval(() => {
            if (document.hidden || railRef.current?.contains(document.activeElement)) return
            setActiveIndex((index) => (index + 1) % dreamDestinations.length)
        }, 7000)
        return () => clearInterval(timer)
    }, [paused, visible, reducedMotion])

    const syncRail = (index) => {
        requestAnimationFrame(() => {
            const item = railRef.current?.children?.[index]
            item?.scrollIntoView({
                behavior: getPreferredScrollBehavior(),
                inline: 'center',
                block: 'nearest',
            })
        })
    }

    const activeDestination = dreamDestinations[activeIndex]

    const getText = (destination, field) => {
        if (!destination) return ''
        return isFr ? destination[field] : (destination[`${field}En`] ?? destination[field])
    }

    const next = () => {
        setPaused(true)
        setActiveIndex((index) => {
            const newIndex = (index + 1) % dreamDestinations.length
            syncRail(newIndex)
            return newIndex
        })
    }

    const previous = () => {
        setPaused(true)
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
        <section ref={sectionRef} id="dreams" className="dream-section">
            <p className="section-kicker">{t('dreams.kicker')}</p>
            <h2>{t('dreams.title')}</h2>
            <p className="dream-section__intro">{t('dreams.intro')}</p>

            <div className="container dream-showcase">
                <div
                    ref={railRef}
                    className="dream-showcase__rail"
                    role="group"
                    aria-label={t('dreams.aria.list')}
                >
                    {dreamDestinations.map((destination, index) => (
                        <button
                            key={destination.id}
                            type="button"
                            className={`dream-showcase__thumb ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => {
                                setPaused(true)
                                setActiveIndex(index)
                                syncRail(index)
                            }}
                            aria-pressed={activeIndex === index}
                        >
                            <span className="dream-showcase__thumb-flag" aria-hidden="true">
                                <CountryFlag code={destination.countryCode} />
                            </span>
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
                            <span className="dream-showcase__emoji" aria-hidden="true">
                                <CountryFlag code={activeDestination.countryCode} />
                            </span>

                            <span className="dream-showcase__counter">{activeProgress}</span>
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
                            <button
                                type="button"
                                onClick={previous}
                                aria-label={t('dreams.aria.previous')}
                            >
                                <FiArrowLeft />
                            </button>

                            <button
                                type="button"
                                disabled={reducedMotion}
                                aria-pressed={paused}
                                onClick={() => setPaused(!paused)}
                                aria-label={
                                    paused
                                        ? isFr
                                            ? 'Reprendre le défilement'
                                            : 'Resume slideshow'
                                        : isFr
                                          ? 'Mettre le défilement en pause'
                                          : 'Pause slideshow'
                                }
                            >
                                {paused || reducedMotion ? <FiPlay /> : <FiPause />}
                            </button>
                            <div className="dream-showcase__dots">
                                {dreamDestinations.map((destination, index) => (
                                    <button
                                        key={destination.id}
                                        type="button"
                                        className={activeIndex === index ? 'active' : ''}
                                        onClick={() => {
                                            setPaused(true)
                                            setActiveIndex(index)
                                            syncRail(index)
                                        }}
                                        aria-label={t('dreams.aria.select', {
                                            destination: getText(destination, 'name'),
                                        })}
                                        aria-pressed={activeIndex === index}
                                    />
                                ))}
                            </div>

                            <button type="button" onClick={next} aria-label={t('dreams.aria.next')}>
                                <FiArrowRight />
                            </button>
                        </div>
                    </motion.article>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default DreamDestinations
