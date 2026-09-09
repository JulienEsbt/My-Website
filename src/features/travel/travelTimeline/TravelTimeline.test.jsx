import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import TravelTimeline from './TravelTimeline.jsx'

vi.mock('../travelGallery/TravelGallery.jsx', () => ({default: () => null}))

describe('travel journal links', () => {
    it('opens the exact trip identified by a journal link', () => {
        render(
            <MemoryRouter initialEntries={['/travel?trip=croatia-2026#stories']}>
                <TravelTimeline />
            </MemoryRouter>
        )
        expect(document.querySelector('#travel-detail-title')).toHaveTextContent('Dubrovnik')
        expect(screen.getByRole('button', {pressed: true})).toHaveTextContent('2026')
        expect(document.getElementById('stories')).toBeInTheDocument()
    })
    it('falls back safely for an unknown trip', () => {
        render(
            <MemoryRouter initialEntries={['/travel?trip=unknown#stories']}>
                <TravelTimeline />
            </MemoryRouter>
        )
        expect(screen.getAllByRole('button', {pressed: true})).toHaveLength(1)
        expect(document.querySelector('#travel-detail-title')).not.toHaveTextContent('unknown')
    })
})
