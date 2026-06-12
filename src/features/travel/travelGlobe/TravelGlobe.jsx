import React, {useEffect, useMemo, useRef} from 'react'
import Globe from 'react-globe.gl'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from "../../../data/travel/dreamDestinations.js";
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
            lat: trip.lat,
            lng: trip.lng,
            size: trip.hasLivedThere ? 0.72 : 0.5,
            color: CATEGORY_COLORS[trip.category] ?? CATEGORY_COLORS.visited,
            label: `${trip.flag} ${trip.city}, ${trip.country} — ${trip.type}`,
        }))

        const dreamPoints = dreamDestinations.map((destination) => ({
            lat: destination.lat,
            lng: destination.lng,
            size: 0.58,
            color: CATEGORY_COLORS.dream,
            label: `${destination.emoji} ${destination.name}, ${destination.country} — Dream destination`,
        }))

        return [...tripPoints, ...dreamPoints]
    }, [visibleTrips])

    const arcs = useMemo(() => (
        visibleTrips.slice(1).map((trip, index) => {
            const previous = visibleTrips[index]

            return {
                startLat: previous.lat,
                startLng: previous.lng,
                endLat: trip.lat,
                endLng: trip.lng,
                color: ['rgba(77,181,255,0.18)', CATEGORY_COLORS[trip.category] ?? '#4db5ff'],
            }
        })
    ), [visibleTrips])

    useEffect(() => {
        if (!globeRef.current) return

        globeRef.current.controls().autoRotate = true
        globeRef.current.controls().autoRotateSpeed = 0.45

        globeRef.current.pointOfView({
            lat: 35,
            lng: 15,
            altitude: expanded ? 1.45 : 1.78,
        })
    }, [expanded])

    return (
        <div className={`travel-globe__shell ${expanded ? 'expanded' : ''}`}>
            <Globe
                ref={globeRef}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                atmosphereColor="#4db5ff"
                atmosphereAltitude={0.22}
                pointsData={points}
                pointAltitude={0.065}
                pointRadius="size"
                pointColor="color"
                pointLabel="label"
                pointsMerge={false}
                arcsData={arcs}
                arcStartLat="startLat"
                arcStartLng="startLng"
                arcEndLat="endLat"
                arcEndLng="endLng"
                arcColor="color"
                arcAltitude={0.22}
                arcStroke={0.65}
                arcDashLength={0.35}
                arcDashGap={0.18}
                arcDashAnimateTime={2400}
                width={expanded ? 1180 : 680}
                height={expanded ? 700 : 500}
            />
        </div>
    )
}

export default TravelGlobe