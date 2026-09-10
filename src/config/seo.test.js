import {describe, expect, it} from 'vitest'
import {getSeoMetadata, INDEXABLE_PATHS, SITE_URL} from './seo.js'

describe('SEO metadata', () => {
    it('returns localized, canonical metadata for a known route', () => {
        const metadata = getSeoMetadata('/projects/bruno-pizza', 'en')

        expect(metadata.title).toContain('Bruno Pizza')
        expect(metadata.description).toContain('desktop application')
        expect(metadata.canonicalUrl).toBe(`${SITE_URL}/en/projects/bruno-pizza`)
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
        expect(INDEXABLE_PATHS).not.toContain('/journal')
        expect(INDEXABLE_PATHS).not.toContain('/en/journal')
        expect(INDEXABLE_PATHS).toContain('/privacy')
        expect(INDEXABLE_PATHS).toContain('/reflections/mefiance-opposition-simple')
    })
    it('infers English from the URL and supplies reciprocal alternatives', () => {
        const seo = getSeoMetadata('/en/reflections/charte-de-pensee')
        expect(seo.language).toBe('en')
        expect(seo.isNotFound).toBe(false)
        expect(seo.alternates).toContainEqual({
            language: 'fr',
            url: `${SITE_URL}/reflections/charte-de-pensee`,
        })
        expect(seo.alternates).toContainEqual({language: 'en', url: seo.canonicalUrl})
        expect(getSeoMetadata('/en').canonicalUrl).toBe(`${SITE_URL}/en`)
    })
})
