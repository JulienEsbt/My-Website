import mapboxgl from 'mapbox-gl'
import type {
    Coordinates,
    TravelMapDreamDestination,
    TravelMapNavigationLabels,
    TravelMapTrip,
} from '../../types/travel'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface PopupContent {
    title: string
    meta: string
    description: string
}

function createPopupContent({title, meta, description}: PopupContent): HTMLDivElement {
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

function addMarker(
    map: mapboxgl.Map,
    {
        className,
        coordinates,
        popup,
    }: {className: string; coordinates: Coordinates; popup: PopupContent}
): void {
    const marker = document.createElement('button')
    marker.type = 'button'
    marker.className = className
    marker.setAttribute('aria-label', `${popup.title} — ${popup.meta}`)

    new mapboxgl.Marker({element: marker, anchor: 'center'})
        .setLngLat([coordinates.lng, coordinates.lat])
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
    navigationLabels,
}: {
    container: HTMLElement
    expanded: boolean
    trips: readonly TravelMapTrip[]
    dreamDestinations: readonly TravelMapDreamDestination[]
    language?: 'fr' | 'en'
    dreamLabel?: string
    navigationLabels: TravelMapNavigationLabels
}) {
    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [12, 43],
        zoom: expanded ? 3.2 : 2.35,
        pitch: expanded ? 42 : 28,
        bearing: 0,
        projection: 'globe',
        attributionControl: false,
        locale: {
            'NavigationControl.ZoomIn': navigationLabels.zoomIn,
            'NavigationControl.ZoomOut': navigationLabels.zoomOut,
            'NavigationControl.ResetBearing': navigationLabels.resetBearing,
            'Popup.CloseButton': navigationLabels.closePopup,
        } as NonNullable<mapboxgl.MapOptions['locale']>,
    })

    const canvas = map.getCanvas()
    canvas.setAttribute('aria-hidden', 'true')
    canvas.removeAttribute('aria-label')
    canvas.removeAttribute('role')
    canvas.tabIndex = -1

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => requestAnimationFrame(() => map.resize()))
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
        const city = language === 'fr' ? trip.city : (trip.cityEn ?? trip.city)
        const country = language === 'fr' ? trip.country : (trip.countryEn ?? trip.country)
        const dateLabel = language === 'fr' ? trip.dateLabel : (trip.dateLabelEn ?? trip.dateLabel)
        const description =
            language === 'fr' ? trip.description : (trip.descriptionEn ?? trip.description)

        addMarker(map, {
            className: `mapbox-marker ${trip.category ?? 'visited'}`,
            coordinates: trip,
            popup: {title: city, meta: `${country} • ${dateLabel}`, description},
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
            coordinates: destination,
            popup: {title: name, meta: `${dreamLabel} • ${country}`, description},
        })
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return {
        resize: () => map.resize(),
        focus: ({lng, lat}: Coordinates) =>
            map.flyTo({
                center: [lng, lat],
                zoom: expanded ? 5.4 : 4.2,
                pitch: expanded ? 34 : 22,
                bearing: 0,
                essential: true,
            }),
        reset: () =>
            map.flyTo({
                center: [12, 43],
                zoom: expanded ? 3.2 : 2.35,
                pitch: expanded ? 42 : 28,
                bearing: 0,
                essential: true,
            }),
        destroy: () => {
            resizeObserver.disconnect()
            map.remove()
        },
    }
}
