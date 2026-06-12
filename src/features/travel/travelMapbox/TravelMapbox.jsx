import React, {useEffect, useRef} from 'react'
import mapboxgl from 'mapbox-gl'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from "../../../data/travel/dreamDestinations.js";
import 'mapbox-gl/dist/mapbox-gl.css'
import './TravelMapbox.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const TravelMapbox = ({expanded = false}) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return

        const initTimer = setTimeout(() => {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-streets-v12',
                center: [12, 43],
                zoom: expanded ? 3.2 : 2.35,
                pitch: expanded ? 42 : 28,
                bearing: -10,
                projection: 'globe',
                attributionControl: false,
            })

            mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

            mapRef.current.on('load', () => {
                mapRef.current.resize()
            })

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
                markerEl.className = `mapbox-marker ${trip.category ?? 'visited'}`

                new mapboxgl.Marker(markerEl)
                    .setLngLat([trip.lng, trip.lat])
                    .setPopup(
                        new mapboxgl.Popup({offset: 20}).setHTML(`
                            <div class="travel-mapbox-popup">
                                <strong>${trip.flag} ${trip.city}</strong>
                                <span>${trip.country} • ${trip.dateLabel}</span>
                                <p>${trip.description}</p>
                            </div>
                        `)
                    )
                    .addTo(mapRef.current)
            })

            dreamDestinations.forEach((destination) => {
                const markerEl = document.createElement('div')
                markerEl.className = 'mapbox-marker dream'

                new mapboxgl.Marker(markerEl)
                    .setLngLat([destination.lng, destination.lat])
                    .setPopup(
                        new mapboxgl.Popup({offset: 20}).setHTML(`
                            <div class="travel-mapbox-popup">
                                <strong>${destination.emoji} ${destination.name}</strong>
                                <span>Destination rêvée • ${destination.country}</span>
                                <p>${destination.reason}</p>
                            </div>
                        `)
                    )
                    .addTo(mapRef.current)
            })

            const resizeObserver = new ResizeObserver(() => {
                mapRef.current?.resize()
            })

            resizeObserver.observe(mapContainer.current)

            mapRef.current.__resizeObserver = resizeObserver
        }, 100)

        return () => {
            clearTimeout(initTimer)
            mapRef.current?.__resizeObserver?.disconnect()
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [])

    useEffect(() => {
        const resize = () => mapRef.current?.resize()

        resize()
        const t1 = setTimeout(resize, 150)
        const t2 = setTimeout(resize, 500)
        const t3 = setTimeout(resize, 1000)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [expanded])

    return (
        <div
            ref={mapContainer}
            className={`travel-mapbox ${expanded ? 'expanded' : ''}`}
        />
    )
}

export default TravelMapbox