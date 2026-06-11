import React from 'react'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {motion} from 'framer-motion'
import L from 'leaflet'
import trips from '../../../data/travel/trips.js'
import 'leaflet/dist/leaflet.css'
import './TravelMap.css'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const TravelMap = () => {
    return (
        <section id="map">
            <h5>Places & memories</h5>
            <h2>World Map</h2>

            <motion.div
                className="container travel-map__container"
                initial={{opacity: 0, y: 40}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.7, ease: 'easeOut'}}
            >
                <MapContainer
                    center={[47.4979, 19.0402]}
                    zoom={4}
                    scrollWheelZoom={false}
                    className="travel-map"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {trips.map((trip) => (
                        <Marker
                            key={trip.id}
                            position={[trip.lat, trip.lng]}
                            icon={markerIcon}
                        >
                            <Popup>
                                <strong>{trip.city}, {trip.country}</strong>
                                <br/>
                                {trip.year}
                                <br/>
                                {trip.description}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </motion.div>
        </section>
    )
}

export default TravelMap