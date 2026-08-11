import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it} from 'vitest'
import i18n from 'i18next'
import TravelVisualizationAlternative from './TravelVisualizationAlternative.jsx'

describe('TravelVisualizationAlternative', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('provides the information and locations represented by the visualizations', async () => {
        const user = userEvent.setup()
        render(<TravelVisualizationAlternative />)

        await user.click(
            screen.getByText('Consulter l’alternative textuelle du globe et de la carte')
        )
        expect(screen.getByRole('heading', {name: 'Voyages et lieux de vie'})).toBeVisible()
        expect(screen.getByRole('heading', {name: 'Destinations rêvées'})).toBeVisible()

        const locationLink = screen.getByRole('link', {
            name: 'Ouvrir Rennes / Saint-Malo dans Google Maps (nouvel onglet)',
        })
        expect(locationLink).toHaveAttribute(
            'href',
            'https://www.google.com/maps?q=48.1173,-1.6778'
        )
    })
})
