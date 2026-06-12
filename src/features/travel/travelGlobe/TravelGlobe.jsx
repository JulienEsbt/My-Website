import React, {useEffect, useMemo, useRef} from 'react'
import Globe from 'react-globe.gl'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
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

    const visibleTrips = useMemo(
        () => trips.filter((trip) => !trip.isPlanned),
        []
    )

    const points = useMemo(() => {
        const tripPoints = visibleTrips.map((trip) => ({
            id: trip.id,
            lat: trip.lat,
            lng: trip.lng,
            size: trip.hasLivedThere ? 0.9 : 0.48,
            altitude: trip.hasLivedThere ? 0.11 : 0.075,
            color: CATEGORY_COLORS[trip.category] ?? CATEGORY_COLORS.visited,
            label: `${trip.flag} ${trip.city}, ${trip.country} — ${trip.type}`,
            shortLabel: trip.city,
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
            label: `${destination.emoji} ${destination.name}, ${destination.country} — Dream destination`,
            shortLabel: destination.name,
            category: 'dream',
            important: true,
        }))

        return [...tripPoints, ...dreamPoints]
    }, [visibleTrips])

    const labelPoints = useMemo(
        () => points.filter((point) => point.important),
        [points]
    )

    const ringPoints = useMemo(
        () => points.filter((point) => point.important),
        [points]
    )

    const arcs = useMemo(() => (
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
        })
    ), [visibleTrips])

    useEffect(() => {
        if (!globeRef.current) return

        const controls = globeRef.current.controls()

        controls.autoRotate = true
        controls.autoRotateSpeed = 0.34
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.minDistance = expanded ? 210 : 255
        controls.maxDistance = expanded ? 650 : 780

        globeRef.current.pointOfView(
            {
                lat: 32,
                lng: 18,
                altitude: expanded ? 1.42 : 1.82,
            },
            900
        )
    }, [expanded])

    const focusPoint = (point) => {
        if (!globeRef.current) return

        globeRef.current.controls().autoRotate = false

        globeRef.current.pointOfView(
            {
                lat: point.lat,
                lng: point.lng,
                altitude: expanded ? 1.05 : 1.25,
            },
            900
        )
    }

    return (
        <div className={`travel-globe__shell ${expanded ? 'expanded' : ''}`}>
            <Globe
                ref={globeRef}
                width={expanded ? 1180 : 680}
                height={expanded ? 700 : 500}
                backgroundColor="rgba(0,0,0,0)"

                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
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
                labelSize={(d) => d.category === 'dream' ? 1.05 : 0.95}
                labelResolution={3}
                labelIncludeDot={false}
                labelDotRadius={0.18}
                labelLabel="label"
                onLabelClick={focusPoint}

                ringsData={ringPoints}
                ringLat="lat"
                ringLng="lng"
                ringColor={(d) => [
                    `${d.color}dd`,
                    `${d.color}55`,
                    `${d.color}00`,
                ]}
                ringMaxRadius={(d) => d.category === 'dream' ? 5.2 : 3.8}
                ringPropagationSpeed={0.85}
                ringRepeatPeriod={(d) => d.category === 'dream' ? 1700 : 2400}
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
                arcDashAnimateTime={2200}
                arcsTransitionDuration={700}
            />
        </div>
    )
}

export default TravelGlobe