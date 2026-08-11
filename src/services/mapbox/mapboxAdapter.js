import mapboxgl from 'mapbox-gl'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function createPopupContent({title, meta, description}) {
    const container = document.createElement('div')
    container.className = 'travel-mapbox-popup'

    const heading = document.createElement('strong')
    heading.textContent = title

    const metadata = document.createElement('span')
    metadata.textContent = meta

    const body = document.createElement('p')
    body.textContent = description

    container.append(heading, metadata, body)
    return container
}

function addMarker(map, {className, coordinates, popup}) {
    const marker = document.createElement('div')
    marker.className = className

    new mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 20}).setDOMContent(createPopupContent(popup)))
        .addTo(map)
}

export function createTravelMap({container, expanded, trips, dreamDestinations}) {
    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [12, 43],
        zoom: expanded ? 3.2 : 2.35,
        pitch: expanded ? 42 : 28,
        bearing: -10,
        projection: 'globe',
        attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => map.resize())
    map.on('style.load', () => {
        map.setFog({
            color: 'rgb(5, 10, 24)',
            'high-color': 'rgb(77, 181, 255)',
            'horizon-blend': 0.08,
            'space-color': 'rgb(2, 6, 18)',
            'star-intensity': 0.45,
        })
    })

    trips.forEach((trip) => {
        addMarker(map, {
            className: `mapbox-marker ${trip.category ?? 'visited'}`,
            coordinates: [trip.lng, trip.lat],
            popup: {
                title: `${trip.flag} ${trip.city}`,
                meta: `${trip.country} • ${trip.dateLabel}`,
                description: trip.description,
            },
        })
    })

    dreamDestinations.forEach((destination) => {
        addMarker(map, {
            className: 'mapbox-marker dream',
            coordinates: [destination.lng, destination.lat],
            popup: {
                title: `${destination.emoji} ${destination.name}`,
                meta: `Destination rêvée • ${destination.country}`,
                description: destination.reason,
            },
        })
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return {
        resize: () => map.resize(),
        destroy: () => {
            resizeObserver.disconnect()
            map.remove()
        },
    }
}
