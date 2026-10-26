import base360avif from '../assets/images/projects/bruno-pizza-hero/base-360.avif'
import base360webp from '../assets/images/projects/bruno-pizza-hero/base-360.webp'
import base720avif from '../assets/images/projects/bruno-pizza-hero/base-720.avif'
import base720webp from '../assets/images/projects/bruno-pizza-hero/base-720.webp'
import base1254avif from '../assets/images/projects/bruno-pizza-hero/base-1254.avif'
import base1254webp from '../assets/images/projects/bruno-pizza-hero/base-1254.webp'
import assembly360avif from '../assets/images/projects/bruno-pizza-hero/assembly-360.avif'
import assembly360webp from '../assets/images/projects/bruno-pizza-hero/assembly-360.webp'
import assembly720avif from '../assets/images/projects/bruno-pizza-hero/assembly-720.avif'
import assembly720webp from '../assets/images/projects/bruno-pizza-hero/assembly-720.webp'
import assembly1254avif from '../assets/images/projects/bruno-pizza-hero/assembly-1254.avif'
import assembly1254webp from '../assets/images/projects/bruno-pizza-hero/assembly-1254.webp'

export const BRUNO_HERO = {
    base: {
        variants: [
            {format: 'avif', width: 360, height: 360, url: base360avif},
            {format: 'fallback', width: 360, height: 360, url: base360webp},
            {format: 'avif', width: 720, height: 720, url: base720avif},
            {format: 'fallback', width: 720, height: 720, url: base720webp},
            {format: 'avif', width: 1254, height: 1254, url: base1254avif},
            {format: 'fallback', width: 1254, height: 1254, url: base1254webp},
        ],
    },
    assembly: {
        variants: [
            {format: 'avif', width: 360, height: 360, url: assembly360avif},
            {format: 'fallback', width: 360, height: 360, url: assembly360webp},
            {format: 'avif', width: 720, height: 720, url: assembly720avif},
            {format: 'fallback', width: 720, height: 720, url: assembly720webp},
            {format: 'avif', width: 1254, height: 1254, url: assembly1254avif},
            {format: 'fallback', width: 1254, height: 1254, url: assembly1254webp},
        ],
    },
}
