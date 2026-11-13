import {describe, expect, it} from 'vitest'
import trips from './trips.js'
import {getSeoMetadata, INDEXABLE_PATHS} from '../../config/seo.js'

describe('completed autumn 2026 trips', () => {
    it('keeps the existing Skopje address while marking the September visit as completed', () => {
        const trip = trips.find(({id}) => id === 'north-macedonia-2026')
        expect(trip).toMatchObject({isPlanned: false, category: 'visited'})
        expect(trip.dateLabel).toBe('22–29 septembre 2026')
        expect(trip.dateLabelEn).toBe('22–29 September 2026')
        expect(trip.story).not.toMatch(/prochain voyage|futur voyage|hâte/i)
        expect(trip.polarstepsUrl).toBe('')
    })

    it('adds the ADE visit with the confirmed dates and personal context in both languages', () => {
        const trip = trips.find(({id}) => id === 'netherlands-2026')
        expect(trip).toMatchObject({
            city: 'Amsterdam',
            countryCode: 'NL',
            isPlanned: false,
            category: 'visited',
        })
        expect(trip.dateLabel).toBe('22–25 octobre 2026')
        expect(trip.dateLabelEn).toBe('22–25 October 2026')
        expect(trip.story).toMatch(/deux potes/)
        expect(trip.storyEn).toMatch(/two friends/)
        for (const [story, description] of [
            [trip.story, trip.description],
            [trip.storyEn, trip.descriptionEn],
        ]) {
            expect(story).toContain('ADE')
            expect(story).toContain('KUKO')
            expect(description).toContain('KUKO (kukocologne)')
        }
        expect(trip.photoAlbumId).toBeUndefined()
    })

    it('makes both language versions of Amsterdam discoverable with their own canonical', () => {
        for (const prefix of ['', '/en']) {
            const path = `${prefix}/travel/netherlands-2026`
            expect(INDEXABLE_PATHS).toContain(path)
            expect(getSeoMetadata(path).canonicalUrl).toBe(`https://www.julienesterbet.com${path}`)
        }
    })
})
