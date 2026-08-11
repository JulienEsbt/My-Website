import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import Goals from './Goals.jsx'

const swiperState = vi.hoisted(() => ({
    autoplay: {start: vi.fn(), stop: vi.fn()},
    props: null,
    reducedMotion: true,
}))

vi.mock('../../../components/common/accessibility/useReducedMotion.js', () => ({
    default: () => swiperState.reducedMotion,
}))

vi.mock('swiper/react', () => ({
    Swiper: ({children, onSwiper, ...props}) => {
        swiperState.props = props
        onSwiper?.({autoplay: swiperState.autoplay})
        return <div>{children}</div>
    },
    SwiperSlide: ({children}) => <div>{children}</div>,
}))

vi.mock('swiper/modules', () => ({
    A11y: {},
    Autoplay: {},
    EffectCoverflow: {},
    Keyboard: {},
    Pagination: {},
}))

vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/effect-coverflow', () => ({}))
vi.mock('swiper/css/pagination', () => ({}))

vi.mock('gsap', () => ({
    gsap: {
        context: vi.fn(() => ({revert: vi.fn()})),
        from: vi.fn(),
        registerPlugin: vi.fn(),
    },
}))

vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {}}))

describe('Goals', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
        swiperState.reducedMotion = true
        vi.clearAllMocks()
    })

    it('disables automatic and coverflow motion when reduced motion is requested', async () => {
        render(<Goals />)

        expect(screen.getByRole('region', {name: 'Ce qui me guide'})).toBeVisible()
        expect(swiperState.props.autoplay).toBe(false)
        expect(swiperState.props.effect).toBe('slide')
        expect(swiperState.props.speed).toBe(0)
        expect(
            screen.queryByRole('button', {name: 'Mettre le défilement en pause'})
        ).not.toBeInTheDocument()
    })

    it('lets the user stop an authorized autoplay', async () => {
        const user = userEvent.setup()
        swiperState.reducedMotion = false
        render(<Goals />)

        await user.click(screen.getByRole('button', {name: 'Mettre le défilement en pause'}))

        expect(swiperState.autoplay.stop).toHaveBeenCalled()
        expect(screen.getByRole('button', {name: 'Reprendre le défilement'})).toBeVisible()
    })
})
