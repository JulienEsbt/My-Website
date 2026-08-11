import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import {getAxeViolations} from '../../../test/axe.js'
import Goals from './Goals.jsx'

const swiperState = vi.hoisted(() => ({props: null}))

vi.mock('../../../components/common/accessibility/useReducedMotion.js', () => ({
    default: () => true,
}))

vi.mock('swiper/react', () => ({
    Swiper: ({children, onSwiper, ...props}) => {
        swiperState.props = props
        onSwiper?.({autoplay: {start: vi.fn(), stop: vi.fn()}})
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

vi.mock('gsap', () => ({
    gsap: {
        context: vi.fn(),
        from: vi.fn(),
        registerPlugin: vi.fn(),
    },
}))

vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {}}))

describe('Goals', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('disables automatic and coverflow motion when reduced motion is requested', async () => {
        const {container} = render(<Goals />)

        expect(screen.getByRole('region', {name: 'Ce qui me guide'})).toBeVisible()
        expect(swiperState.props.autoplay).toBe(false)
        expect(swiperState.props.effect).toBe('slide')
        expect(swiperState.props.speed).toBe(0)
        expect(
            screen.queryByRole('button', {name: 'Mettre le défilement en pause'})
        ).not.toBeInTheDocument()
        expect(await getAxeViolations(container)).toEqual([])
    })
})
