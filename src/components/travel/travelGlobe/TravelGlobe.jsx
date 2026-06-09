import React, {useEffect, useMemo, useRef} from 'react'
import Globe from 'react-globe.gl'
import trips from '../../../data/travel/trips'
import './TravelGlobe.css'

const TravelGlobe = ({expanded = false}) => {
    const globeRef = useRef()

    const points = useMemo(() => (
        trips.map((trip) => ({
            lat: trip.lat,
            lng: trip.lng,
            size: 0.55,
            color: '#4db5ff',
            label: `${trip.city}, ${trip.country}`,
        }))
    ), [])

    const arcs = useMemo(() => (
        trips.slice(1).map((trip, index) => {
            const previous = trips[index]

            return {
                startLat: previous.lat,
                startLng: previous.lng,
                endLat: trip.lat,
                endLng: trip.lng,
                color: ['rgba(77,181,255,0.25)', '#4db5ff'],
            }
        })
    ), [])

    useEffect(() => {
        if (!globeRef.current) return

        globeRef.current.controls().autoRotate = true
        globeRef.current.controls().autoRotateSpeed = 0.45

        globeRef.current.pointOfView({
            lat: 35,
            lng: 20,
            altitude: expanded ? 1.45 : 1.75,
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
                pointAltitude={0.06}
                pointRadius="size"
                pointColor="color"
                pointLabel="label"
                arcsData={arcs}
                arcStartLat="startLat"
                arcStartLng="startLng"
                arcEndLat="endLat"
                arcEndLng="endLng"
                arcColor="color"
                arcAltitude={0.22}
                arcStroke={0.7}
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