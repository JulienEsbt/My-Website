import {describe, expect, it} from 'vitest'
import {createMediaResolver, resolveMediaUrl} from './media.js'

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

    it('can serve generated derivatives from a configured HTTPS media origin', () => {
        const getHomeMedia = createMediaResolver(manifest, 'home', 'https://media.example.com/')

        expect(getHomeMedia('header/photo.jpg').variants[0].url).toBe(
            'https://media.example.com/media/photo.avif'
        )
        expect(resolveMediaUrl('/media/photo.avif', 'http://unsafe.example.com')).toBe(
            '/media/photo.avif'
        )
    })
})
