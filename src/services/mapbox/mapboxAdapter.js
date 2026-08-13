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
    const marker = document.createElement('button')
    marker.type = 'button'
    marker.className = className
    marker.setAttribute('aria-label', `${popup.title} — ${popup.meta}`)

    new mapboxgl.Marker({element: marker, anchor: 'center'})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 20}).setDOMContent(createPopupContent(popup)))
        .addTo(map)
}

export function createTravelMap({
    container,
    expanded,
    trips,
    dreamDestinations,
    language = 'fr',
    dreamLabel = 'Destination rêvée',
    navigationLabels = {},
}) {
    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [12, 43],
        zoom: expanded ? 3.2 : 2.35,
        pitch: 0,
        bearing: 0,
        projection: 'mercator',
        attributionControl: false,
        locale: {
            'NavigationControl.ZoomIn': navigationLabels.zoomIn,
            'NavigationControl.ZoomOut': navigationLabels.zoomOut,
            'NavigationControl.ResetBearing': navigationLabels.resetBearing,
            'Popup.CloseButton': navigationLabels.closePopup,
        },
    })

    const canvas = map.getCanvas()
    canvas.setAttribute('aria-hidden', 'true')
    canvas.removeAttribute('aria-label')
    canvas.removeAttribute('role')
    canvas.tabIndex = -1

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => requestAnimationFrame(() => map.resize()))

    trips.forEach((trip) => {
        const city = language === 'fr' ? trip.city : (trip.cityEn ?? trip.city)
        const country = language === 'fr' ? trip.country : (trip.countryEn ?? trip.country)
        const dateLabel = language === 'fr' ? trip.dateLabel : (trip.dateLabelEn ?? trip.dateLabel)
        const description =
            language === 'fr' ? trip.description : (trip.descriptionEn ?? trip.description)

        addMarker(map, {
            className: `mapbox-marker ${trip.category ?? 'visited'}`,
            coordinates: [trip.lng, trip.lat],
            popup: {
                title: city,
                meta: `${country} • ${dateLabel}`,
                description,
            },
        })
    })

    dreamDestinations.forEach((destination) => {
        const name = language === 'fr' ? destination.name : (destination.nameEn ?? destination.name)
        const country =
            language === 'fr' ? destination.country : (destination.countryEn ?? destination.country)
        const description =
            language === 'fr' ? destination.reason : (destination.reasonEn ?? destination.reason)

        addMarker(map, {
            className: 'mapbox-marker dream',
            coordinates: [destination.lng, destination.lat],
            popup: {
                title: name,
                meta: `${dreamLabel} • ${country}`,
                description,
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
