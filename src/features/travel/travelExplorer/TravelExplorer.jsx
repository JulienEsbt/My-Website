import React, {lazy, Suspense, useRef, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiMaximize2, FiMinimize2, FiGlobe, FiMap, FiMousePointer, FiPlay} from 'react-icons/fi'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import useFocusTrap from '../../../components/common/accessibility/useFocusTrap.js'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'
import FeatureLoading from '../../../components/common/feedback/featureLoading/FeatureLoading.jsx'
import TravelVisualizationAlternative from './TravelVisualizationAlternative.jsx'
import './TravelExplorer.css'

const TravelGlobe = lazy(() => import('../travelGlobe/TravelGlobe.jsx'))
const TravelMapbox = lazy(() => import('../travelMapbox/TravelMapbox.jsx'))

const TravelExplorer = () => {
    const {t} = useTranslation('travel')
    const [activeView, setActiveView] = useState(null)
    const [mobileView, setMobileView] = useState('globe')
    const [loadedViews, setLoadedViews] = useState({globe: false, map: false})
    const isMobile = useMediaQuery('(max-width: 600px), (max-height: 500px) and (max-width: 950px)')
    const expandedViewRef = useRef(null)
    const reduceButtonRef = useRef(null)
    const expandButtonRef = useRef(null)
    const showGlobe = !isMobile || mobileView === 'globe'
    const showMap = !isMobile || mobileView === 'map'

    const currentTitle = activeView === 'globe' ? t('explorer.globeTitle') : t('explorer.mapTitle')

    const currentText = activeView === 'globe' ? t('explorer.globeText') : t('explorer.mapText')

    const loadView = (view) => {
        setLoadedViews((current) => (current[view] ? current : {...current, [view]: true}))
    }

    const expandView = (view) => {
        loadView(view)
        setActiveView(view)
    }

    const closeExpandedView = () => setActiveView(null)

    useFocusTrap({
        active: isMobile && Boolean(activeView),
        containerRef: expandedViewRef,
        initialFocusRef: reduceButtonRef,
        onDismiss: closeExpandedView,
        returnFocusRef: expandButtonRef,
    })

    useBodyScrollLock(isMobile && Boolean(activeView))

    return (
        <section id="travel-explorer" className="travel-explorer-section">
            <p className="section-kicker">{t('explorer.kicker')}</p>
            <h2>{t('explorer.title')}</h2>
            <p className="travel-explorer__subtitle">{t('explorer.subtitle')}</p>

            <div className="travel-explorer__divider" />

            <div className="travel-explorer__legend">
                {['home', 'lived', 'study', 'visited', 'planned', 'dream'].map((category) => (
                    <span key={category} className="travel-explorer__legend-item">
                        <i className={`travel-explorer__legend-dot ${category}`} />
                        {t(`explorer.legend.${category}`)}
                    </span>
                ))}
            </div>

            <div className="travel-explorer__mobile-switch">
                <button
                    type="button"
                    className={mobileView === 'globe' ? 'active' : ''}
                    onClick={() => setMobileView('globe')}
                    aria-pressed={mobileView === 'globe'}
                >
                    <FiGlobe />
                    {t('explorer.globeTitle')}
                </button>

                <button
                    type="button"
                    className={mobileView === 'map' ? 'active' : ''}
                    onClick={() => setMobileView('map')}
                    aria-pressed={mobileView === 'map'}
                >
                    <FiMap />
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
                            {showGlobe && (
                                <article className="travel-explorer__card travel-explorer__card--globe mobile-active">
                                    <div className="travel-explorer__card-header">
                                        <div className="travel-explorer__title-row">
                                            <span className="travel-explorer__icon">
                                                <FiGlobe />
                                            </span>
                                            <div>
                                                <h3>{t('explorer.globeTitle')}</h3>
                                                <p>{t('explorer.globeText')}</p>
                                            </div>
                                        </div>

                                        <button
                                            ref={expandButtonRef}
                                            type="button"
                                            className="travel-explorer__expand-btn"
                                            onClick={() => expandView('globe')}
                                            aria-label={t('explorer.expandGlobe')}
                                        >
                                            <FiMaximize2 />
                                        </button>
                                    </div>

                                    <div className="travel-explorer__visual travel-explorer__visual--globe">
                                        {loadedViews.globe ? (
                                            <Suspense fallback={<FeatureLoading fill />}>
                                                <TravelGlobe />
                                            </Suspense>
                                        ) : (
                                            <button
                                                type="button"
                                                className="travel-explorer__load"
                                                onClick={() => loadView('globe')}
                                            >
                                                <FiPlay />
                                                {t('explorer.loadGlobe')}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            )}

                            {showMap && (
                                <article className="travel-explorer__card travel-explorer__card--map mobile-active">
                                    <div className="travel-explorer__card-header">
                                        <div className="travel-explorer__title-row">
                                            <span className="travel-explorer__icon">
                                                <FiMap />
                                            </span>
                                            <div>
                                                <h3>{t('explorer.mapTitle')}</h3>
                                                <p>{t('explorer.mapText')}</p>
                                            </div>
                                        </div>

                                        <button
                                            ref={expandButtonRef}
                                            type="button"
                                            className="travel-explorer__expand-btn"
                                            onClick={() => expandView('map')}
                                            aria-label={t('explorer.expandMap')}
                                        >
                                            <FiMaximize2 />
                                        </button>
                                    </div>

                                    <div className="travel-explorer__visual">
                                        {loadedViews.map ? (
                                            <Suspense fallback={<FeatureLoading fill />}>
                                                <TravelMapbox />
                                            </Suspense>
                                        ) : (
                                            <button
                                                type="button"
                                                className="travel-explorer__load"
                                                onClick={() => loadView('map')}
                                            >
                                                <FiPlay />
                                                {t('explorer.loadMap')}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            )}
                        </motion.div>
                    )}

                    {activeView && (
                        <motion.div
                            ref={expandedViewRef}
                            key={activeView}
                            className="travel-explorer__expanded"
                            initial={{opacity: 0, scale: 0.96, y: 30}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.96, y: -20}}
                            transition={{duration: 0.35}}
                            role={isMobile ? 'dialog' : undefined}
                            aria-modal={isMobile ? 'true' : undefined}
                            aria-labelledby="travel-explorer-expanded-title"
                            tabIndex={isMobile ? -1 : undefined}
                        >
                            <div className="travel-explorer__card-header">
                                <div className="travel-explorer__title-row">
                                    <span className="travel-explorer__icon">
                                        {activeView === 'globe' ? <FiGlobe /> : <FiMap />}
                                    </span>
                                    <div>
                                        <h3 id="travel-explorer-expanded-title">{currentTitle}</h3>
                                        <p>{currentText}</p>
                                    </div>
                                </div>

                                <button
                                    ref={reduceButtonRef}
                                    type="button"
                                    className="travel-explorer__expand-btn"
                                    onClick={closeExpandedView}
                                    aria-label={t('explorer.reduce')}
                                >
                                    <FiMinimize2 />
                                </button>
                            </div>

                            <div className="travel-explorer__expanded-visual">
                                <Suspense fallback={<FeatureLoading fill />}>
                                    {activeView === 'globe' ? (
                                        <TravelGlobe expanded />
                                    ) : (
                                        <TravelMapbox expanded />
                                    )}
                                </Suspense>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <TravelVisualizationAlternative />

                <div className="travel-explorer__hint">
                    <FiMousePointer />
                    <span>{t('explorer.loadHint')}</span>
                </div>
            </div>
        </section>
    )
}

export default TravelExplorer
