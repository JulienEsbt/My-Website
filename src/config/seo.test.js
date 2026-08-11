import {describe, expect, it} from 'vitest'
import {getSeoMetadata, INDEXABLE_PATHS, SITE_URL} from './seo.js'

describe('SEO metadata', () => {
    it('returns localized, canonical metadata for a known route', () => {
        const metadata = getSeoMetadata('/projects/bruno-pizza', 'en')

        expect(metadata.title).toContain('Bruno Pizza')
        expect(metadata.description).toContain('desktop application')
        expect(metadata.canonicalUrl).toBe(`${SITE_URL}/projects/bruno-pizza`)
        expect(metadata.robots).toBe('index, follow')
        expect(metadata.structuredData['@type']).toBe('SoftwareApplication')
    })

    it('creates article metadata from the reflection source of truth', () => {
        const metadata = getSeoMetadata('/reflections/charte-de-pensee', 'fr')

        expect(metadata.title).toBe('Charte de pensée — Julien Esterbet')
        expect(metadata.type).toBe('article')
        expect(metadata.structuredData['@type']).toBe('Article')
    })

    it('marks unknown routes as non-indexable', () => {
        const metadata = getSeoMetadata('/route-inconnue', 'fr')

        expect(metadata.isNotFound).toBe(true)
        expect(metadata.robots).toBe('noindex, nofollow')
        expect(metadata.structuredData).toBeNull()
    })

    it('lists every public static and editorial route once', () => {
        expect(new Set(INDEXABLE_PATHS).size).toBe(INDEXABLE_PATHS.length)
        expect(INDEXABLE_PATHS).toContain('/resume')
        expect(INDEXABLE_PATHS).toContain('/reflections/mefiance-opposition-simple')
    })
})
