import portrait160avif from '../assets/images/home/thumbnails/home-thumb-portrait-160.avif?no-inline'
import portrait160webp from '../assets/images/home/thumbnails/home-thumb-portrait-160.webp?no-inline'
import portrait256avif from '../assets/images/home/thumbnails/home-thumb-portrait-256.avif?no-inline'
import portrait256webp from '../assets/images/home/thumbnails/home-thumb-portrait-256.webp?no-inline'
import portrait320avif from '../assets/images/home/thumbnails/home-thumb-portrait-320.avif?no-inline'
import portrait320webp from '../assets/images/home/thumbnails/home-thumb-portrait-320.webp?no-inline'
import bruno160avif from '../assets/images/home/thumbnails/home-thumb-bruno-160.avif?no-inline'
import bruno160webp from '../assets/images/home/thumbnails/home-thumb-bruno-160.webp?no-inline'
import bruno320avif from '../assets/images/home/thumbnails/home-thumb-bruno-320.avif?no-inline'
import bruno320webp from '../assets/images/home/thumbnails/home-thumb-bruno-320.webp?no-inline'
import opendente160avif from '../assets/images/home/thumbnails/home-thumb-opendente-160.avif?no-inline'
import opendente160webp from '../assets/images/home/thumbnails/home-thumb-opendente-160.webp?no-inline'
import opendente320avif from '../assets/images/home/thumbnails/home-thumb-opendente-320.avif?no-inline'
import opendente320webp from '../assets/images/home/thumbnails/home-thumb-opendente-320.webp?no-inline'
import website160avif from '../assets/images/home/thumbnails/home-thumb-website-160.avif?no-inline'
import website160webp from '../assets/images/home/thumbnails/home-thumb-website-160.webp?no-inline'
import website320avif from '../assets/images/home/thumbnails/home-thumb-website-320.avif?no-inline'
import website320webp from '../assets/images/home/thumbnails/home-thumb-website-320.webp?no-inline'

export const HOME_THUMBNAILS = {
    portrait: {
        variants: [
            {format: 'avif', width: 160, height: 201, url: portrait160avif},
            {format: 'fallback', width: 160, height: 201, url: portrait160webp},
            {format: 'avif', width: 256, height: 322, url: portrait256avif},
            {format: 'fallback', width: 256, height: 322, url: portrait256webp},
            {format: 'avif', width: 320, height: 402, url: portrait320avif},
            {format: 'fallback', width: 320, height: 402, url: portrait320webp},
        ],
    },
    bruno: {
        variants: [
            {format: 'avif', width: 160, height: 100, url: bruno160avif},
            {format: 'fallback', width: 160, height: 100, url: bruno160webp},
            {format: 'avif', width: 320, height: 201, url: bruno320avif},
            {format: 'fallback', width: 320, height: 201, url: bruno320webp},
        ],
    },
    opendente: {
        variants: [
            {format: 'avif', width: 160, height: 100, url: opendente160avif},
            {format: 'fallback', width: 160, height: 100, url: opendente160webp},
            {format: 'avif', width: 320, height: 200, url: opendente320avif},
            {format: 'fallback', width: 320, height: 200, url: opendente320webp},
        ],
    },
    website: {
        variants: [
            {format: 'avif', width: 160, height: 67, url: website160avif},
            {format: 'fallback', width: 160, height: 67, url: website160webp},
            {format: 'avif', width: 320, height: 133, url: website320avif},
            {format: 'fallback', width: 320, height: 133, url: website320webp},
        ],
    },
}
