import React, {useEffect, useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import trips from '../../../data/travel/trips.js'
import 'mapbox-gl/dist/mapbox-gl.css'
import './TravelMapbox.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const TravelMapbox = ({expanded = false}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [38, 42],
            zoom: expanded ? 3.35 : 2.75,
            pitch: expanded ? 45 : 35,
            bearing: -12,
            projection: 'globe',
            attributionControl: false,
        })

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

        mapRef.current.on('style.load', () => {
            mapRef.current.setFog({
                color: 'rgb(5, 10, 24)',
                'high-color': 'rgb(77, 181, 255)',
                'horizon-blend': 0.08,
                'space-color': 'rgb(2, 6, 18)',
                'star-intensity': 0.45,
            })
        })

        trips.forEach((trip) => {
            const markerEl = document.createElement('div')
            markerEl.className = 'mapbox-marker'

            new mapboxgl.Marker(markerEl)
                .setLngLat([trip.lng, trip.lat])
                .setPopup(
                    new mapboxgl.Popup({offset: 20}).setHTML(`
                        <strong>${trip.city}, ${trip.country}</strong>
                        <br/>
                        <span>${trip.year}</span>
                        <p>${trip.description}</p>
                    `)
                )
                .addTo(mapRef.current)
        })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            mapRef.current?.resize()
        }, 250)
    }, [expanded])

    return (
        <div
            ref={mapContainer}
            className={`travel-mapbox ${expanded ? 'expanded' : ''}`}
        />
    )
}

export default TravelMapbox