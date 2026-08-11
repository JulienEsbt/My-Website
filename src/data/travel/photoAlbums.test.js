import {describe, expect, it} from 'vitest'
import {loadTripPhotos} from './photoAlbums.js'

describe('loadTripPhotos', () => {
    it('returns an empty album for a trip without photos', async () => {
        await expect(loadTripPhotos('unknown-trip')).resolves.toEqual([])
    })

    it('loads and caches only the requested album', async () => {
        const firstLoad = loadTripPhotos('saint-barth-2023')
        const secondLoad = loadTripPhotos('saint-barth-2023')

        expect(secondLoad).toBe(firstLoad)
        await expect(firstLoad).resolves.toHaveLength(9)
    })
})
