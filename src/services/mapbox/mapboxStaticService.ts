import type {Coordinates} from '../../types/travel'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function getStaticTravelMapUrl(
    location: Coordinates | null | undefined,
    token: string | undefined = MAPBOX_TOKEN
): string | null {
    if (!token || !location) return null
    if (!Number.isFinite(location.lng) || !Number.isFinite(location.lat)) return null
    if (location.lng < -180 || location.lng > 180 || location.lat < -90 || location.lat > 90) {
        return null
    }

    const coordinates = `${location.lng},${location.lat}`
    const accessToken = encodeURIComponent(token)

    return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/pin-s+4db5ff(${coordinates})/${coordinates},4,0/600x260@2x?access_token=${accessToken}`
}
