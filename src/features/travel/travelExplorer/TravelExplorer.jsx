import React, {lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {FiCrosshair, FiMaximize2, FiMinimize2, FiGlobe, FiMap, FiSearch} from 'react-icons/fi'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import useFocusTrap from '../../../components/common/accessibility/useFocusTrap.js'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'
import useImmersiveNavigation from '../../../components/common/accessibility/useImmersiveNavigation.js'
import FeatureLoading from '../../../components/common/feedback/featureLoading/FeatureLoading.jsx'
import './TravelExplorer.css'

const TravelGlobe = lazy(() => import('../travelGlobe/TravelGlobe.jsx'))
const TravelMapbox = lazy(() => import('../travelMapbox/TravelMapbox.jsx'))

const TravelExplorer = () => {
    const {t, i18n} = useTranslation('travel')
    const [activeView, setActiveView] = useState(null)
    const [mobileView, setMobileView] = useState('globe')
    const [loadedViews, setLoadedViews] = useState({globe: false, map: false})
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [resetSignal, setResetSignal] = useState(0)
    const [showArcs, setShowArcs] = useState(true)
    const isMobile = useMediaQuery('(max-width: 600px), (max-height: 500px) and (max-width: 950px)')
    const expandedViewRef = useRef(null)
    const sectionRef = useRef(null)
    const reduceButtonRef = useRef(null)
    const expandButtonRef = useRef(null)
    const showGlobe = !isMobile || mobileView === 'globe'
    const showMap = !isMobile || mobileView === 'map'
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    const filteredLocations = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase(isFr ? 'fr' : 'en')
        const tripLocations = trips.map((trip) => ({...trip, kind: 'trip'}))
        const dreamLocations = dreamDestinations.map((destination) => ({
            ...destination,
            kind: 'dream',
            category: 'dream',
        }))

        return [...tripLocations, ...dreamLocations].filter((location) => {
            if (category !== 'all' && location.category !== category) return false
            if (!normalizedQuery) return true

            const searchable =
                location.kind === 'trip'
                    ? [location.city, location.cityEn, location.country, location.countryEn]
                    : [location.name, location.nameEn, location.country, location.countryEn]

            return searchable.some((value) =>
                value?.toLocaleLowerCase(isFr ? 'fr' : 'en').includes(normalizedQuery)
            )
        })
    }, [category, isFr, query])

    const filteredTrips = useMemo(
        () => filteredLocations.filter((location) => location.kind === 'trip'),
        [filteredLocations]
    )
    const filteredDreams = useMemo(
        () => filteredLocations.filter((location) => location.kind === 'dream'),
        [filteredLocations]
    )

    const resetView = useCallback(() => {
        setSelectedLocation(null)
        setResetSignal((value) => value + 1)
    }, [])

    const resetExplorer = useCallback(() => {
        setQuery('')
        setCategory('all')
        resetView()
    }, [resetView])

    const selectLocation = useCallback((location) => {
        setSelectedLocation(location)
    }, [])

    const explorerProps = {
        trips: filteredTrips,
        dreamDestinations: filteredDreams,
        selectedLocation,
        onSelectLocation: selectLocation,
        onResetView: resetView,
        resetSignal,
    }

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
    useImmersiveNavigation(isMobile && Boolean(activeView))

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return undefined

        const loadVisibleViews = () => {
            setLoadedViews((current) => ({
                globe: current.globe || !isMobile || mobileView === 'globe',
                map: current.map || !isMobile || mobileView === 'map',
            }))
        }

        if (!('IntersectionObserver' in window)) {
            loadVisibleViews()
            return undefined
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                loadVisibleViews()
                observer.disconnect()
            },
            {rootMargin: '320px 0px'}
        )

        observer.observe(section)
        return () => observer.disconnect()
    }, [isMobile, mobileView])

    return (
        <section id="travel-explorer" ref={sectionRef} className="travel-explorer-section">
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

            <div
                className="container travel-explorer__controls"
                aria-label={t('explorer.controls.label')}
            >
                <label className="travel-explorer__search">
                    <FiSearch aria-hidden="true" />
                    <span className="sr-only">{t('explorer.controls.searchLabel')}</span>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t('explorer.controls.searchPlaceholder')}
                    />
                </label>
                <label>
                    <span className="sr-only">{t('explorer.controls.categoryLabel')}</span>
                    <select value={category} onChange={(event) => setCategory(event.target.value)}>
                        <option value="all">{t('explorer.controls.all')}</option>
                        {['home', 'lived', 'study', 'visited', 'planned', 'dream'].map((item) => (
                            <option key={item} value={item}>
                                {t(`explorer.legend.${item}`)}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="button" onClick={resetExplorer}>
                    <FiCrosshair aria-hidden="true" />
                    {t('explorer.controls.recenter')}
                </button>
            </div>

            <details className="container travel-explorer__accessible-list">
                <summary>
                    {t('explorer.controls.results', {count: filteredLocations.length})}
                </summary>
                <ul>
                    {filteredLocations.map((location) => {
                        const name =
                            location.kind === 'trip'
                                ? isFr
                                    ? location.city
                                    : (location.cityEn ?? location.city)
                                : isFr
                                  ? location.name
                                  : (location.nameEn ?? location.name)
                        const countryName = isFr
                            ? location.country
                            : (location.countryEn ?? location.country)
                        return (
                            <li key={`${location.kind}-${location.id}`}>
                                <button type="button" onClick={() => selectLocation(location)}>
                                    <span aria-hidden="true">
                                        {location.kind === 'trip' ? location.flag : location.emoji}
                                    </span>
                                    <span>
                                        <strong>{name}</strong> — {countryName}
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </details>

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
                                                <TravelGlobe
                                                    {...explorerProps}
                                                    showArcs={showArcs}
                                                    onToggleArcs={() =>
                                                        setShowArcs((value) => !value)
                                                    }
                                                />
                                            </Suspense>
                                        ) : (
                                            <FeatureLoading fill />
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
                                                <TravelMapbox {...explorerProps} />
                                            </Suspense>
                                        ) : (
                                            <FeatureLoading fill />
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
                                        <TravelGlobe
                                            expanded
                                            {...explorerProps}
                                            showArcs={showArcs}
                                            onToggleArcs={() => setShowArcs((value) => !value)}
                                        />
                                    ) : (
                                        <TravelMapbox expanded {...explorerProps} />
                                    )}
                                </Suspense>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default TravelExplorer
