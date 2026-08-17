import {render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import TravelGlobe from './TravelGlobe.jsx'

const globeState = vi.hoisted(() => ({
    controls: {},
    pointOfView: vi.fn(),
    props: null,
}))

vi.mock('../../../components/common/accessibility/useReducedMotion.js', () => ({
    default: () => true,
}))

vi.mock('react-globe.gl', async () => {
    const React = await import('react')
    const MockGlobe = React.forwardRef((props, ref) => {
        globeState.props = props
        React.useImperativeHandle(ref, () => ({
            controls: () => globeState.controls,
            pointOfView: globeState.pointOfView,
        }))
        return <div data-testid="globe-canvas" />
    })
    MockGlobe.displayName = 'MockGlobe'

    return {
        default: MockGlobe,
    }
})

describe('TravelGlobe', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
        globeState.controls = {}
        globeState.pointOfView.mockClear()
    })

    it('disables continuous and transition motion when reduced motion is requested', async () => {
        render(<TravelGlobe />)

        expect(
            screen.getByRole('img', {
                name: 'Représentation graphique des voyages et destinations rêvées sur un globe terrestre',
            })
        ).toBeVisible()

        await waitFor(() => expect(globeState.controls.autoRotate).toBe(false))
        expect(globeState.controls.enableDamping).toBe(false)
        expect(globeState.props.ringsData).toEqual([])
        expect(globeState.props.arcDashAnimateTime).toBe(0)
        expect(globeState.props.arcsTransitionDuration).toBe(0)
        expect(globeState.pointOfView).toHaveBeenCalledWith({altitude: 1.82, lat: 32, lng: 18}, 0)
    })

    it('sizes the WebGL scene from its responsive container', async () => {
        const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            width: 320,
            height: 336,
        })

        render(<TravelGlobe />)

        await waitFor(() => expect(globeState.props.width).toBe(320))
        expect(globeState.props.height).toBe(336)
        rectSpy.mockRestore()
    })

    it('shares a clicked globe destination with the other explorer view', async () => {
        const onSelectLocation = vi.fn()
        const trip = {
            id: 'tallinn',
            city: 'Tallinn',
            country: 'Estonie',
            type: 'Séminaire',
            category: 'study',
            lat: 59.437,
            lng: 24.7536,
        }

        render(<TravelGlobe trips={[trip]} onSelectLocation={onSelectLocation} />)

        await waitFor(() => expect(globeState.props.pointsData).toHaveLength(1))
        globeState.props.onPointClick(globeState.props.pointsData[0])

        expect(onSelectLocation).toHaveBeenCalledWith(
            expect.objectContaining({id: 'tallinn', lat: 59.437, lng: 24.7536})
        )
        expect(globeState.pointOfView).toHaveBeenLastCalledWith(
            {altitude: 1.25, lat: 59.437, lng: 24.7536},
            0
        )
    })
})
