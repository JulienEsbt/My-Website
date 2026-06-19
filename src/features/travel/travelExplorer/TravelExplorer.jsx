import React, {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiMaximize2, FiMinimize2, FiGlobe, FiMap, FiMousePointer} from 'react-icons/fi'
import TravelGlobe from '../travelGlobe/TravelGlobe.jsx'
import TravelMapbox from '../travelMapbox/TravelMapbox.jsx'
import './TravelExplorer.css'

const TravelExplorer = () => {
    const {t} = useTranslation('travel')
    const [activeView, setActiveView] = useState(null)
    const [mobileView, setMobileView] = useState('globe')

    const currentTitle = activeView === 'globe'
        ? t('explorer.globeTitle')
        : t('explorer.mapTitle')

    const currentText = activeView === 'globe'
        ? t('explorer.globeText')
        : t('explorer.mapText')

    return (
        <section id="travel-explorer" className="travel-explorer-section">
            <h5>{t('explorer.kicker')}</h5>
            <h2>{t('explorer.title')}</h2>
            <p className="travel-explorer__subtitle">
                {t('explorer.subtitle')}
            </p>

            <div className="travel-explorer__divider"/>

            <div className="travel-explorer__legend">
                {['home', 'lived', 'study', 'visited', 'planned', 'dream'].map((category) => (
                    <span key={category} className="travel-explorer__legend-item">
                        <i className={`travel-explorer__legend-dot ${category}`}/>
                        {t(`explorer.legend.${category}`)}
                    </span>
                ))}
            </div>

            <div className="travel-explorer__mobile-switch">
                <button
                    type="button"
                    className={mobileView === 'globe' ? 'active' : ''}
                    onClick={() => setMobileView('globe')}
                >
                    <FiGlobe/>
                    {t('explorer.globeTitle')}
                </button>

                <button
                    type="button"
                    className={mobileView === 'map' ? 'active' : ''}
                    onClick={() => setMobileView('map')}
                >
                    <FiMap/>
                    {t('explorer.mapTitle')}
                </button>
            </div>

            <div className="container travel-explorer">
                <AnimatePresence mode="wait">
                    {!activeView && (
                        <motion.div
                            key="compact"
                            className="travel-explorer__grid"
                            initial={{opacity: 0, y: 28}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.35}}
                        >
                            <article
                                className={`travel-explorer__card travel-explorer__card--globe ${mobileView === 'globe' ? 'mobile-active' : ''}`}>
                                <div className="travel-explorer__card-header">
                                    <div className="travel-explorer__title-row">
                                        <span className="travel-explorer__icon">
                                            <FiGlobe/>
                                        </span>
                                        <div>
                                            <h3>{t('explorer.globeTitle')}</h3>
                                            <p>{t('explorer.globeText')}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="travel-explorer__expand-btn"
                                        onClick={() => setActiveView('globe')}
                                        aria-label={t('explorer.expandGlobe')}
                                    >
                                        <FiMaximize2/>
                                    </button>
                                </div>

                                <div className="travel-explorer__visual travel-explorer__visual--globe">
                                    <TravelGlobe/>
                                </div>
                            </article>

                            <article
                                className={`travel-explorer__card travel-explorer__card--map ${mobileView === 'map' ? 'mobile-active' : ''}`}>
                                <div className="travel-explorer__card-header">
                                    <div className="travel-explorer__title-row">
                                        <span className="travel-explorer__icon">
                                            <FiMap/>
                                        </span>
                                        <div>
                                            <h3>{t('explorer.mapTitle')}</h3>
                                            <p>{t('explorer.mapText')}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="travel-explorer__expand-btn"
                                        onClick={() => setActiveView('map')}
                                        aria-label={t('explorer.expandMap')}
                                    >
                                        <FiMaximize2/>
                                    </button>
                                </div>

                                <div className="travel-explorer__visual">
                                    <TravelMapbox/>
                                </div>
                            </article>
                        </motion.div>
                    )}

                    {activeView && (
                        <motion.div
                            key={activeView}
                            className="travel-explorer__expanded"
                            initial={{opacity: 0, scale: 0.96, y: 30}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.96, y: -20}}
                            transition={{duration: 0.35}}
                        >
                            <div className="travel-explorer__card-header">
                                <div className="travel-explorer__title-row">
                                    <span className="travel-explorer__icon">
                                        {activeView === 'globe' ? <FiGlobe/> : <FiMap/>}
                                    </span>
                                    <div>
                                        <h3>{currentTitle}</h3>
                                        <p>{currentText}</p>
                                    </div>
                                </div>

                                <button
                                    className="travel-explorer__expand-btn"
                                    onClick={() => setActiveView(null)}
                                    aria-label={t('explorer.reduce')}
                                >
                                    <FiMinimize2/>
                                </button>
                            </div>

                            <div className="travel-explorer__expanded-visual">
                                {activeView === 'globe' ? (
                                    <TravelGlobe expanded/>
                                ) : (
                                    <TravelMapbox expanded/>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="travel-explorer__hint">
                    <FiMousePointer/>
                    <span>{t('explorer.hint')}</span>
                </div>
            </div>
        </section>
    )
}

export default TravelExplorer