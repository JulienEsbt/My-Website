import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import i18n, {loadNamespaces} from '../i18n/i18n.js'
import HomeTravelCarousel from '../features/home/discover/HomeTravelCarousel.jsx'
import DreamDestinations from '../features/travel/dreamDestinations/DreamDestinations.jsx'
import TravelGallery from '../features/travel/travelGallery/TravelGallery.jsx'
import BrunoGallery from '../features/projects/brunoGallery/BrunoGallery.jsx'
import MobileDeck from '../components/common/mobile/MobileDeck.jsx'

vi.mock('framer-motion', async (importOriginal) => ({
    ...(await importOriginal()),
    // Exit animation keeps obsolete controls mounted under JSDOM's fake clock.
    // Test the current card's controls; real exit transitions are covered in browser tests.
    AnimatePresence: ({children}) => children,
}))

vi.mock('../data/travel/photoAlbums.js', () => ({
    loadTripPhotos: () =>
        Promise.resolve(
            Array.from({length: 5}, (_, index) => ({
                src: {id: `photo-${index}`, variants: [{url: `/photo-${index}.avif`}]},
            }))
        ),
}))

vi.mock('../components/common/media/ResponsiveImage.jsx', () => ({
    default: ({media, alt}) => <img src={media.variants[0].url} alt={alt} />,
}))

let observations
let hidden

const advance = (milliseconds) => act(() => vi.advanceTimersByTime(milliseconds))

beforeEach(async () => {
    await loadNamespaces(['projects'])
    await i18n.changeLanguage('fr')
    vi.useFakeTimers()
    hidden = false
    observations = []
    vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
    }))
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            constructor(callback) {
                this.callback = callback
            }
            observe(target) {
                observations.push(this)
                this.target = target
                this.callback([{target, isIntersecting: true}])
            }
            disconnect() {}
        }
    )
})

afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe.each(['home', 'entry'])('HomeTravelCarousel (%s)', (variant) => {
    it('continues after arrows, selection, hover and focus; only Pause stops it', () => {
        render(
            <MemoryRouter>
                <HomeTravelCarousel language="fr" readLabel="Lire ce récit" variant={variant} />
            </MemoryRouter>
        )
        const region = screen.getByRole('region', {name: 'Récits de voyage sélectionnés'})
        const image = () => within(region).getByRole('img').alt
        fireEvent.mouseEnter(region)
        fireEvent.focus(within(region).getByRole('link'))
        fireEvent.click(screen.getByRole('button', {name: 'Voyage suivant'}))
        const manuallySelected = image()
        advance(6000)
        expect(image()).not.toBe(manuallySelected)

        fireEvent.click(screen.getByRole('button', {name: /Italie/}))
        const selectedByDot = image()
        advance(6000)
        expect(image()).not.toBe(selectedByDot)

        fireEvent.click(screen.getByRole('button', {name: 'Mettre les voyages en pause'}))
        fireEvent.click(screen.getByRole('button', {name: 'Voyage précédent'}))
        const pausedSelection = image()
        advance(12000)
        expect(image()).toBe(pausedSelection)
        fireEvent.click(screen.getByRole('button', {name: 'Reprendre le défilement des voyages'}))
        advance(6000)
        expect(image()).not.toBe(pausedSelection)
    })

    it('keeps the existing hidden-tab and off-screen safeguards', () => {
        render(
            <MemoryRouter>
                <HomeTravelCarousel language="fr" readLabel="Lire ce récit" variant={variant} />
            </MemoryRouter>
        )
        const image = () => screen.getByRole('img').alt
        const initial = image()
        hidden = true
        advance(6000)
        expect(image()).toBe(initial)
        hidden = false
        act(() => observations[0].callback([{isIntersecting: false}]))
        advance(6000)
        expect(image()).toBe(initial)
        act(() => observations[0].callback([{isIntersecting: true}]))
        advance(6000)
        expect(image()).not.toBe(initial)
    })

    it('does not autoplay when reduced motion is requested', () => {
        vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
        }))
        render(
            <MemoryRouter>
                <HomeTravelCarousel language="fr" readLabel="Lire ce récit" variant={variant} />
            </MemoryRouter>
        )
        const initial = screen.getByRole('img').alt
        advance(12000)
        expect(screen.getByRole('img').alt).toBe(initial)
        expect(screen.queryByRole('button', {name: 'Mettre les voyages en pause'})).toBeNull()
    })
})

describe('DreamDestinations autoplay', () => {
    it('continues after arrows and focused destination choices, preserving explicit pause', () => {
        render(<DreamDestinations />)
        const rail = screen.getByRole('group', {name: 'Sélection des destinations rêvées'})
        const selected = () => within(rail).getByRole('button', {pressed: true}).textContent
        fireEvent.click(screen.getByRole('button', {name: 'Destination suivante'}))
        fireEvent.focus(within(rail).getAllByRole('button')[1])
        const manualSelection = selected()
        advance(7000)
        expect(selected()).not.toBe(manualSelection)

        fireEvent.click(screen.getByRole('button', {name: 'Mettre le défilement en pause'}))
        fireEvent.click(within(rail).getAllByRole('button')[3])
        const pausedSelection = selected()
        advance(14000)
        expect(selected()).toBe(pausedSelection)
        fireEvent.click(screen.getByRole('button', {name: 'Reprendre le défilement'}))
        advance(7000)
        expect(selected()).not.toBe(pausedSelection)
    })
})

describe('TravelGallery autoplay', () => {
    it('continues after arrow keys and thumbnails and keeps an explicit pause', async () => {
        await act(async () => {
            render(<TravelGallery albumId="test-album" city="Ville test" onOpenChange={() => {}} />)
        })
        fireEvent.click(screen.getByRole('button', {name: 'Voir la photo 1'}))
        fireEvent.keyDown(window, {key: 'ArrowRight'})
        expect(screen.getByRole('img', {name: /photo 2 sur 5/})).toBeInTheDocument()
        advance(6500)
        expect(screen.getByRole('img', {name: /photo 3 sur 5/})).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: 'Mettre le défilement en pause'}))
        fireEvent.click(screen.getByRole('button', {name: 'Voir la photo 5'}))
        advance(13000)
        expect(screen.getByRole('img', {name: /photo 5 sur 5/})).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', {name: 'Reprendre le défilement'}))
        advance(6500)
        expect(screen.getByRole('img', {name: /photo 1 sur 5/})).toBeInTheDocument()
    })

    it('keeps an explicit pause when a photo is reopened from the preview', async () => {
        await act(async () => {
            render(<TravelGallery albumId="test-album" city="Ville test" onOpenChange={() => {}} />)
        })
        fireEvent.click(screen.getByRole('button', {name: 'Voir la photo 1'}))
        fireEvent.click(screen.getByRole('button', {name: 'Mettre le défilement en pause'}))
        fireEvent.click(screen.getByRole('button', {name: 'Fermer la galerie'}))
        fireEvent.click(screen.getByRole('button', {name: 'Voir la photo 2'}))
        advance(13000)
        expect(screen.getByRole('img', {name: /photo 2 sur 5/})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Reprendre le défilement'})).toHaveAttribute(
            'aria-pressed',
            'true'
        )
    })
})

describe('BrunoGallery autoplay', () => {
    it('continues after arrows, hover and focus and retains Pause across thumbnails', () => {
        render(<BrunoGallery />)
        const region = screen.getByRole('region', {name: 'Bruno Pizza en images'})
        const selected = () =>
            screen.getByRole('button', {pressed: true}).getAttribute('aria-label')
        fireEvent.mouseEnter(region)
        fireEvent.focus(screen.getByRole('button', {name: 'Capture suivante'}))
        fireEvent.click(screen.getByRole('button', {name: 'Capture suivante'}))
        const manualSelection = selected()
        advance(6500)
        expect(selected()).not.toBe(manualSelection)

        fireEvent.click(screen.getByRole('button', {name: 'Mettre le diaporama en pause'}))
        fireEvent.click(screen.getByRole('button', {name: 'Gestion des ingrédients'}))
        advance(13000)
        expect(selected()).toBe('Gestion des ingrédients')
        fireEvent.click(screen.getByRole('button', {name: 'Lancer le diaporama'}))
        advance(6500)
        expect(selected()).not.toBe('Gestion des ingrédients')
    })
})

describe('MobileDeck autoplay', () => {
    it('continues after manual navigation and pointer focus; Pause remains explicit', () => {
        vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
            matches: query === '(max-width: 700px)',
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
        }))
        vi.stubGlobal(
            'ResizeObserver',
            class {
                observe() {}
                disconnect() {}
            }
        )
        render(
            <MobileDeck label="Cartes de test">
                <button>Première carte</button>
                <button>Deuxième carte</button>
                <button>Troisième carte</button>
            </MobileDeck>
        )
        const region = screen.getByRole('region', {name: 'Cartes de test'})
        const track = region.querySelector('.mobile-deck__track')
        track.getBoundingClientRect = () => ({left: 0})
        Array.from(track.children).forEach((card, index) => {
            card.getBoundingClientRect = () => ({left: index * 300 - track.scrollLeft})
        })
        track.scrollTo = ({left}) => {
            track.scrollLeft = left
            fireEvent.scroll(track)
        }
        fireEvent.click(screen.getByRole('button', {name: 'Carte suivante'}))
        expect(track.scrollLeft).toBe(300)
        fireEvent.pointerDown(screen.getByRole('button', {name: 'Deuxième carte'}))
        fireEvent.focus(screen.getByRole('button', {name: 'Deuxième carte'}))
        advance(6500)
        expect(track.scrollLeft).toBe(600)

        fireEvent.click(screen.getByRole('button', {name: 'Mettre le défilement en pause'}))
        fireEvent.click(screen.getByRole('button', {name: 'Carte précédente'}))
        advance(13000)
        expect(track.scrollLeft).toBe(300)
        fireEvent.click(screen.getByRole('button', {name: 'Reprendre le défilement'}))
        advance(6500)
        expect(track.scrollLeft).toBe(600)
    })
})
