import React, {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {FiMaximize2, FiMinimize2, FiGlobe, FiMap, FiMousePointer} from 'react-icons/fi'
import TravelGlobe from '../travelGlobe/TravelGlobe'
import TravelMapbox from '../travelMapbox/TravelMapbox'
import './TravelExplorer.css'

const TravelExplorer = () => {
    const [activeView, setActiveView] = useState(null)

    return (
        <section id="travel-explorer" className="travel-explorer-section">
            <h5>Interactive world</h5>
            <h2>Globe & Map</h2>
            <p className="travel-explorer__subtitle">
                Explorez les lieux qui ont marqué mon parcours à travers le temps.
            </p>

            <div className="travel-explorer__divider"/>

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
                            <article className="travel-explorer__card">
                                <div className="travel-explorer__card-header">
                                    <div className="travel-explorer__title-row">
                                        <span className="travel-explorer__icon">
                                            <FiGlobe/>
                                        </span>
                                        <div>
                                            <h3>Globe 3D</h3>
                                            <p>Vue immersive de mes destinations</p>
                                        </div>
                                    </div>

                                    <button
                                        className="travel-explorer__expand-btn"
                                        onClick={() => setActiveView('globe')}
                                        aria-label="Agrandir le globe"
                                    >
                                        <FiMaximize2/>
                                    </button>
                                </div>

                                <div className="travel-explorer__visual travel-explorer__visual--globe">
                                    <TravelGlobe/>
                                </div>
                            </article>

                            <article className="travel-explorer__card">
                                <div className="travel-explorer__card-header">
                                    <div className="travel-explorer__title-row">
                                        <span className="travel-explorer__icon">
                                            <FiMap/>
                                        </span>
                                        <div>
                                            <h3>Mapbox</h3>
                                            <p>Carte détaillée et interactive</p>
                                        </div>
                                    </div>

                                    <button
                                        className="travel-explorer__expand-btn"
                                        onClick={() => setActiveView('map')}
                                        aria-label="Agrandir la carte"
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
                                        <h3>{activeView === 'globe' ? 'Globe 3D' : 'Mapbox'}</h3>
                                        <p>
                                            {activeView === 'globe'
                                                ? 'Vue immersive de mes destinations'
                                                : 'Carte détaillée et interactive'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="travel-explorer__expand-btn"
                                    onClick={() => setActiveView(null)}
                                    aria-label="Réduire"
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
                    <span>Cliquez sur une carte pour l’agrandir et explorer en détail</span>
                </div>
            </div>
        </section>
    )
}

export default TravelExplorer