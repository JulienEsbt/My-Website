import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import ResponsiveImage from './ResponsiveImage.jsx'

const media = {
    variants: [
        {format: 'avif', url: '/media/photo/320.avif', width: 320, height: 240},
        {format: 'avif', url: '/media/photo/960.avif', width: 960, height: 720},
        {format: 'webp', url: '/media/photo/320.webp', width: 320, height: 240},
        {format: 'fallback', url: '/media/photo/320.jpg', width: 320, height: 240},
        {format: 'fallback', url: '/media/photo/960.jpg', width: 960, height: 720},
    ],
}

describe('ResponsiveImage', () => {
    it('expose les formats modernes, les dimensions et la stratégie de chargement', () => {
        const {container} = render(
            <ResponsiveImage
                media={media}
                alt="Photo de test"
                sizes="(max-width: 700px) 100vw, 520px"
                fetchPriority="high"
            />
        )

        const image = screen.getByRole('img', {name: 'Photo de test'})
        const sources = container.querySelectorAll('source')

        expect(sources).toHaveLength(2)
        expect(sources[0]).toHaveAttribute('type', 'image/avif')
        expect(sources[0]).toHaveAttribute(
            'srcset',
            '/media/photo/320.avif 320w, /media/photo/960.avif 960w'
        )
        expect(image).toHaveAttribute('src', '/media/photo/960.jpg')
        expect(image).toHaveAttribute('srcset', '/media/photo/320.jpg 320w, /media/photo/960.jpg 960w')
        expect(image).toHaveAttribute('sizes', '(max-width: 700px) 100vw, 520px')
        expect(image).toHaveAttribute('width', '960')
        expect(image).toHaveAttribute('height', '720')
        expect(image).toHaveAttribute('loading', 'lazy')
        expect(image).toHaveAttribute('decoding', 'async')
        expect(image).toHaveAttribute('fetchpriority', 'high')
    })
})
