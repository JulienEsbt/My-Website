import {act, fireEvent, render, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import TravelMapbox from './TravelMapbox.jsx'

const mapState = vi.hoisted(() => ({
    createTravelMap: vi.fn(),
    map: {
        destroy: vi.fn(),
        focus: vi.fn(),
        reset: vi.fn(),
        resize: vi.fn(),
    },
}))

vi.mock('../../../services/mapbox/mapboxAdapter.js', () => ({
    createTravelMap: mapState.createTravelMap,
}))

describe('TravelMapbox', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
        vi.useFakeTimers()
        vi.clearAllMocks()
        mapState.createTravelMap.mockReturnValue(mapState.map)
    })

    afterEach(() => {
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
    })

    it('exposes an overview control inside the map', () => {
        const onResetView = vi.fn()

        render(<TravelMapbox onResetView={onResetView} />)
        act(() => vi.advanceTimersByTime(100))

        fireEvent.click(screen.getByRole('button', {name: 'Vue d’ensemble'}))

        expect(onResetView).toHaveBeenCalledOnce()
        expect(mapState.createTravelMap).toHaveBeenCalledOnce()
    })
    it('reports provider failures without restarting or hiding the map', () => {
        render(<TravelMapbox />)
        act(() => vi.advanceTimersByTime(100))
        act(() => mapState.createTravelMap.mock.calls[0][0].onError())
        expect(screen.getByRole('status')).toHaveTextContent('Certaines données de la carte')
        expect(screen.getByRole('region')).toBeInTheDocument()
        act(() => vi.advanceTimersByTime(1000))
        expect(mapState.createTravelMap).toHaveBeenCalledOnce()
    })
    it('keeps navigation available when initialization fails', () => {
        mapState.createTravelMap.mockImplementationOnce(() => {
            throw new Error('Provider unavailable')
        })
        render(<TravelMapbox />)
        act(() => vi.advanceTimersByTime(100))
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Vue d’ensemble'})).toBeInTheDocument()
    })
})
