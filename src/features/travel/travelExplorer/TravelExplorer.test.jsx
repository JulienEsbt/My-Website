import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import TravelExplorer from './TravelExplorer.jsx'

vi.mock('../../../components/common/accessibility/useMediaQuery.js', () => ({
    default: () => true,
}))

vi.mock('../travelGlobe/TravelGlobe.jsx', () => ({
    default: () => <div>Globe chargé</div>,
}))

vi.mock('../travelMapbox/TravelMapbox.jsx', () => ({
    default: () => <div>Carte chargée</div>,
}))

describe('TravelExplorer', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('handles the mobile expanded visualization as a modal dialog', async () => {
        const user = userEvent.setup()
        render(<TravelExplorer />)

        const expandButton = screen.getByRole('button', {name: 'Agrandir le globe'})
        await user.click(expandButton)

        const dialog = await screen.findByRole('dialog', {name: 'Globe 3D'})
        expect(dialog).toHaveAttribute('aria-modal', 'true')
        await waitFor(() => expect(screen.getByRole('button', {name: 'Réduire'})).toHaveFocus())

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() =>
            expect(screen.getByRole('button', {name: 'Agrandir le globe'})).toHaveFocus()
        )
    })
})
