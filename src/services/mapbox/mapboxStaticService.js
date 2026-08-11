const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function getStaticTravelMapUrl(location, token = MAPBOX_TOKEN) {
    if (!token || !location) return null

    const {lng, lat} = location
    const coordinates = `${lng},${lat}`

    return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/pin-s+4db5ff(${coordinates})/${coordinates},4,0/600x260@2x?access_token=${token}`
}
