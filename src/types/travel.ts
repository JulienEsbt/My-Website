export interface Coordinates {
    lng: number
    lat: number
}

export interface TravelMapTrip extends Coordinates {
    city: string
    cityEn?: string
    country: string
    countryEn?: string
    dateLabel: string
    dateLabelEn?: string
    description: string
    descriptionEn?: string
    category?: string
}

export interface TravelMapDreamDestination extends Coordinates {
    name: string
    nameEn?: string
    country: string
    countryEn?: string
    reason: string
    reasonEn?: string
}

export interface TravelMapNavigationLabels {
    zoomIn: string
    zoomOut: string
    resetBearing: string
    closePopup: string
}
