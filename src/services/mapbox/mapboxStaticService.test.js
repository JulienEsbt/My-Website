import {describe, expect, it} from 'vitest'
import {getStaticTravelMapUrl} from './mapboxStaticService.js'

describe('getStaticTravelMapUrl', () => {
    it('returns no URL without a token or location', () => {
        expect(getStaticTravelMapUrl(null, 'public-token')).toBeNull()
        expect(getStaticTravelMapUrl({lng: 2.35, lat: 48.86}, '')).toBeNull()
    })

    it('builds the expected Mapbox static URL', () => {
        expect(getStaticTravelMapUrl({lng: 2.35, lat: 48.86}, 'public-token')).toBe(
            'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/pin-s+4db5ff(2.35,48.86)/2.35,48.86,4,0/600x260@2x?access_token=public-token'
        )
    })
})
