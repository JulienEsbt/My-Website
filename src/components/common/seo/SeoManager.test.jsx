import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, describe, expect, it} from 'vitest'
import SeoManager from './SeoManager.jsx'

afterEach(() => {
    document.head.querySelectorAll('[data-seo-json-ld]').forEach((element) => element.remove())
})

describe('SeoManager', () => {
    it('updates route metadata and JSON-LD', async () => {
        render(
            <MemoryRouter initialEntries={['/projects/bruno-pizza']}>
                <SeoManager />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.title).toContain('Bruno Pizza')
        })
        expect(document.head.querySelector('meta[name="description"]')?.content).toContain(
            'desktop application'
        )
        expect(document.head.querySelector('link[rel="canonical"]')?.href).toBe(
            'https://www.julienesterbet.com/projects/bruno-pizza'
        )
        expect(document.head.querySelector('meta[property="og:image"]')?.content).toContain(
            '/og/julien-esterbet-portfolio.png'
        )
        expect(document.head.querySelector('script[data-seo-json-ld]')).not.toBeNull()
    })

    it('prevents unknown routes from being indexed', async () => {
        render(
            <MemoryRouter initialEntries={['/inconnue']}>
                <SeoManager />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.head.querySelector('meta[name="robots"]')?.content).toBe(
                'noindex, nofollow'
            )
        })
    })
})
