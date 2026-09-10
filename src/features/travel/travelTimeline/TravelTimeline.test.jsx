import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, useLocation} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import TravelTimeline from './TravelTimeline.jsx'

vi.mock('../travelGallery/TravelGallery.jsx', () => ({default: () => null}))

const LocationProbe = () => {
    const location = useLocation()
    return (
        <output data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</output>
    )
}

describe('travel journal links', () => {
    it('opens the exact trip identified by a clean URL', () => {
        render(
            <MemoryRouter initialEntries={['/travel/croatia-2026']}>
                <TravelTimeline routeTripId="croatia-2026" />
            </MemoryRouter>
        )
        expect(document.querySelector('#travel-detail-title')).toHaveTextContent('Dubrovnik')
        expect(screen.getByRole('button', {pressed: true})).toHaveTextContent('2026')
        expect(document.getElementById('stories')).toBeInTheDocument()
    })

    it('keeps an old journal link working and replaces it with its clean URL', async () => {
        render(
            <MemoryRouter initialEntries={['/travel?trip=croatia-2026#stories']}>
                <TravelTimeline />
                <LocationProbe />
            </MemoryRouter>
        )

        expect(document.querySelector('#travel-detail-title')).toHaveTextContent('Dubrovnik')
        await waitFor(() =>
            expect(screen.getByTestId('location')).toHaveTextContent('/travel/croatia-2026#stories')
        )
    })

    it('creates a localized clean URL when a trip is selected', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/en/travel']}>
                <TravelTimeline />
                <LocationProbe />
            </MemoryRouter>
        )

        const dubrovnik2026 = screen
            .getAllByRole('button', {name: /Dubrovnik/i})
            .find((button) => button.textContent.includes('2026'))
        await user.click(dubrovnik2026)
        expect(screen.getByTestId('location')).toHaveTextContent('/en/travel/croatia-2026#stories')
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
