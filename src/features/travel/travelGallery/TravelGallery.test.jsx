import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import TravelGallery from './TravelGallery.jsx'

vi.mock('../../../data/travel/photoAlbums.js', () => ({
    loadTripPhotos: vi.fn(() =>
        Promise.resolve([
            {src: {id: 'photo-1', variants: [{url: '/photo-1.avif'}]}},
            {src: {id: 'photo-2', variants: [{url: '/photo-2.avif'}]}},
        ])
    ),
}))

vi.mock('../../../components/common/media/ResponsiveImage.jsx', () => ({
    default: ({media, alt}) => <img src={media.variants[0].url} alt={alt} />,
}))

describe('TravelGallery', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('loads the selected album and controls the accessible lightbox', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(<TravelGallery albumId="test-album" city="Ville test" onOpenChange={onOpenChange} />)

        const openButton = await screen.findByRole('button', {name: 'Voir la photo 1'})
        await user.click(openButton)

        expect(onOpenChange).toHaveBeenLastCalledWith(true)
        expect(screen.getByRole('dialog', {name: 'Galerie photo — Ville test'})).toBeVisible()
        expect(
            screen.getByText(
                'Utilisez les flèches gauche et droite pour changer de photo, et la touche Échap pour fermer la galerie.'
            )
        ).toBeInTheDocument()
        expect(
            screen.getByRole('img', {name: 'Souvenir de voyage à Ville test — photo 1 sur 2'})
        ).toBeVisible()

        await user.keyboard('{ArrowRight}')
        expect(
            screen.getByRole('img', {name: 'Souvenir de voyage à Ville test — photo 2 sur 2'})
        ).toBeVisible()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(onOpenChange).toHaveBeenLastCalledWith(false)
        expect(openButton).toHaveFocus()
    })
})
