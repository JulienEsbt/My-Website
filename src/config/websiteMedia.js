import hero480avif from '../assets/images/projects/my-website/hero-480.avif'
import hero480webp from '../assets/images/projects/my-website/hero-480.webp'
import hero800avif from '../assets/images/projects/my-website/hero-800.avif'
import hero800webp from '../assets/images/projects/my-website/hero-800.webp'
import hero1200avif from '../assets/images/projects/my-website/hero-1200.avif'
import hero1200webp from '../assets/images/projects/my-website/hero-1200.webp'
import hero1440avif from '../assets/images/projects/my-website/hero-1440.avif'
import hero1440webp from '../assets/images/projects/my-website/hero-1440.webp'

export const WEBSITE_COVER = {
    variants: [
        {format: 'avif', width: 480, height: 200, url: hero480avif},
        {format: 'fallback', width: 480, height: 200, url: hero480webp},
        {format: 'avif', width: 800, height: 333, url: hero800avif},
        {format: 'fallback', width: 800, height: 333, url: hero800webp},
        {format: 'avif', width: 1200, height: 500, url: hero1200avif},
        {format: 'fallback', width: 1200, height: 500, url: hero1200webp},
        {format: 'avif', width: 1440, height: 600, url: hero1440avif},
        {format: 'fallback', width: 1440, height: 600, url: hero1440webp},
    ],
}
