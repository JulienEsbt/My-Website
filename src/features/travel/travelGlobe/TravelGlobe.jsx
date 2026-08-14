import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import Globe from 'react-globe.gl'
import {useTranslation} from 'react-i18next'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import './TravelGlobe.css'

const CATEGORY_COLORS = {
    home: '#9b7cff',
    lived: '#4ade80',
    study: '#facc15',
    work: '#c084fc',
    visited: '#4db5ff',
    planned: '#fb7185',
    dream: '#ff9f43',
}

const TravelGlobe = ({expanded = false}) => {
    const globeRef = useRef()
    const shellRef = useRef(null)
    const [dimensions, setDimensions] = useState({width: 1, height: 1})
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')
    const reducedMotion = useReducedMotion()
    const [motionPaused, setMotionPaused] = useState(reducedMotion)

    const visibleTrips = useMemo(() => trips.filter((trip) => !trip.isPlanned), [])

    const points = useMemo(() => {
        const tripPoints = visibleTrips.map((trip) => ({
            id: trip.id,
            lat: trip.lat,
            lng: trip.lng,
            size: trip.hasLivedThere ? 0.9 : 0.48,
            altitude: trip.hasLivedThere ? 0.11 : 0.075,
            color: CATEGORY_COLORS[trip.category] ?? CATEGORY_COLORS.visited,
            label: `${trip.flag} ${isFr ? trip.city : (trip.cityEn ?? trip.city)}, ${
                isFr ? trip.country : (trip.countryEn ?? trip.country)
            } — ${isFr ? trip.type : (trip.typeEn ?? trip.type)}`,
            shortLabel: isFr ? trip.city : (trip.cityEn ?? trip.city),
            category: trip.category,
            important: trip.hasLivedThere || trip.category === 'home' || trip.category === 'lived',
        }))

        const dreamPoints = dreamDestinations.map((destination) => ({
            id: destination.id,
            lat: destination.lat,
            lng: destination.lng,
            size: 0.7,
            altitude: 0.095,
            color: CATEGORY_COLORS.dream,
            label: `${destination.emoji} ${
                isFr ? destination.name : (destination.nameEn ?? destination.name)
            }, ${isFr ? destination.country : (destination.countryEn ?? destination.country)} — ${t(
                'explorer.legend.dream'
            )}`,
            shortLabel: isFr ? destination.name : (destination.nameEn ?? destination.name),
            category: 'dream',
            important: true,
        }))

        return [...tripPoints, ...dreamPoints]
    }, [isFr, t, visibleTrips])

    const labelPoints = useMemo(() => points.filter((point) => point.important), [points])

    const ringPoints = useMemo(() => points.filter((point) => point.important), [points])

    const arcs = useMemo(
        () =>
            visibleTrips.slice(1).map((trip, index) => {
                const previous = visibleTrips[index]

                return {
                    startLat: previous.lat,
                    startLng: previous.lng,
                    endLat: trip.lat,
                    endLng: trip.lng,
                    color: [
                        'rgba(77,181,255,0.08)',
                        CATEGORY_COLORS[trip.category] ?? CATEGORY_COLORS.visited,
                    ],
                }
            }),
        [visibleTrips]
    )

    useLayoutEffect(() => {
        const shell = shellRef.current
        if (!shell) return undefined

        const updateDimensions = () => {
            const {width, height} = shell.getBoundingClientRect()
            const nextDimensions = {
                width: Math.max(1, Math.round(width)),
                height: Math.max(1, Math.round(height)),
            }

            setDimensions((current) =>
                current.width === nextDimensions.width && current.height === nextDimensions.height
                    ? current
                    : nextDimensions
            )
        }

        updateDimensions()
        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateDimensions)
            return () => window.removeEventListener('resize', updateDimensions)
        }

        const observer = new ResizeObserver(updateDimensions)
        observer.observe(shell)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!globeRef.current) return

        const controls = globeRef.current.controls()

        controls.autoRotate = !reducedMotion && !motionPaused
        controls.autoRotateSpeed = 0.34
        controls.enableDamping = !reducedMotion
        controls.dampingFactor = 0.08
        controls.minDistance = expanded ? 210 : 255
        controls.maxDistance = expanded ? 650 : 780

        globeRef.current.pointOfView(
            {
                lat: 32,
                lng: 18,
                altitude: expanded ? 1.42 : 1.82,
            },
            reducedMotion ? 0 : 900
        )
    }, [expanded, motionPaused, reducedMotion])

    useEffect(() => {
        if (reducedMotion) setMotionPaused(true)
    }, [reducedMotion])

    const focusPoint = (point) => {
        if (!globeRef.current) return

        globeRef.current.controls().autoRotate = false

        globeRef.current.pointOfView(
            {
                lat: point.lat,
                lng: point.lng,
                altitude: expanded ? 1.05 : 1.25,
            },
            reducedMotion ? 0 : 900
        )
    }

    return (
        <div ref={shellRef} className={`travel-globe__shell ${expanded ? 'expanded' : ''}`}>
            <div
                className="travel-globe__scene"
                role="img"
                aria-label={t('explorer.globeAccessibleLabel')}
            >
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="rgba(0,0,0,0)"

                    globeImageUrl="/textures/globe/earth-night.jpg"
                    bumpImageUrl="/textures/globe/earth-topology.png"
                    showAtmosphere
                    atmosphereColor="#4db5ff"
                    atmosphereAltitude={0.26}
                    globeCurvatureResolution={4}

                    pointsData={points}
                    pointLat="lat"
                    pointLng="lng"
                    pointAltitude="altitude"
                    pointRadius="size"
                    pointColor="color"
                    pointLabel="label"
                    pointResolution={20}
                    pointsMerge={false}
                    onPointClick={focusPoint}

                    labelsData={labelPoints}
                    labelLat="lat"
                    labelLng="lng"
                    labelText="shortLabel"
                    labelColor={(d) => d.color}
                    labelAltitude={0.17}
                    labelSize={(d) => (d.category === 'dream' ? 1.05 : 0.95)}
                    labelResolution={3}
                    labelIncludeDot={false}
                    labelDotRadius={0.18}
                    labelLabel="label"
                    onLabelClick={focusPoint}

                    ringsData={reducedMotion || motionPaused ? [] : ringPoints}
                    ringLat="lat"
                    ringLng="lng"
                    ringColor={(d) => [`${d.color}dd`, `${d.color}55`, `${d.color}00`]}
                    ringMaxRadius={(d) => (d.category === 'dream' ? 5.2 : 3.8)}
                    ringPropagationSpeed={0.85}
                    ringRepeatPeriod={(d) => (d.category === 'dream' ? 1700 : 2400)}
                    ringResolution={48}

                    arcsData={arcs}
                    arcStartLat="startLat"
                    arcStartLng="startLng"
                    arcEndLat="endLat"
                    arcEndLng="endLng"
                    arcColor="color"
                    arcAltitude={0.32}
                    arcStroke={0.75}
                    arcCurveResolution={64}
                    arcCircularResolution={8}
                    arcDashLength={0.42}
                    arcDashGap={0.22}
                    arcDashAnimateTime={reducedMotion || motionPaused ? 0 : 2200}
                    arcsTransitionDuration={reducedMotion || motionPaused ? 0 : 700}
                />
            </div>

            {!reducedMotion && (
                <button
                    type="button"
                    className="travel-globe__motion-control"
                    onClick={() => setMotionPaused((paused) => !paused)}
                >
                    {motionPaused
                        ? t('explorer.globeMotion.resume')
                        : t('explorer.globeMotion.pause')}
                </button>
            )}
        </div>
    )
}

export default TravelGlobe
