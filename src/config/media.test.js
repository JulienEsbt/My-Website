import {describe, expect, it} from 'vitest'
import {createMediaResolver} from './media.js'

describe('createMediaResolver', () => {
    const manifest = [
        {
            source: 'src/assets/images/home/header/photo.jpg',
            variants: [{format: 'avif', url: '/media/photo.avif', width: 480, height: 320}],
        },
    ]

    it('resolves only media belonging to its domain', () => {
        const getHomeMedia = createMediaResolver(manifest, 'home')

        expect(getHomeMedia('header/photo.jpg')).toMatchObject({
            id: 'home/header/photo.jpg',
            source: 'src/assets/images/home/header/photo.jpg',
        })
        expect(() => getHomeMedia('header/missing.jpg')).toThrow(
            'Média généré introuvable pour home/header/missing.jpg'
        )
    })
})
