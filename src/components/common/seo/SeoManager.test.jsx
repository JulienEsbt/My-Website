import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {Link, MemoryRouter} from 'react-router-dom'
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

it('replaces prerendered structured data when navigating and changing route type', async () => {
    const initial = document.createElement('script')
    initial.type = 'application/ld+json'
    initial.dataset.seoJsonLd = 'true'
    initial.textContent = JSON.stringify({'@type': 'Article', headline: 'Old article'})
    document.head.appendChild(initial)
    render(
        <MemoryRouter initialEntries={['/']}>
            <SeoManager />
            <Link to="/reflections/charte-de-pensee">Article</Link>
            <Link to="/reflections">List</Link>
        </MemoryRouter>
    )
    await waitFor(() => expect(document.querySelectorAll('[data-seo-json-ld]')).toHaveLength(1))
    expect(document.head.textContent).not.toContain('Old article')
    fireEvent.click(screen.getByText('Article'))
    await waitFor(() => expect(document.title).toContain('Charte'))
    expect(document.querySelectorAll('[data-seo-json-ld]')).toHaveLength(1)
    expect(JSON.parse(document.querySelector('[data-seo-json-ld]').textContent)['@type']).toBe(
        'Article'
    )
    fireEvent.click(screen.getByText('List'))
    await waitFor(() => expect(document.querySelector('[data-seo-json-ld]')).toBeNull())
})
