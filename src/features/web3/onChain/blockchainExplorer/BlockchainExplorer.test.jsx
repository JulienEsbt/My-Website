import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import {BLOCKCHAIN_NETWORKS} from '../../../../config/blockchains.js'
import BlockchainExplorer from './BlockchainExplorer.jsx'

const carouselState = vi.hoisted(() => ({
    autoScroll: vi.fn(() => ({})),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn(),
}))

vi.mock('../../../../components/common/accessibility/useReducedMotion.js', () => ({
    default: () => true,
}))

vi.mock('embla-carousel-auto-scroll', () => ({
    default: carouselState.autoScroll,
}))

vi.mock('embla-carousel-react', () => ({
    default: () => [
        vi.fn(),
        {scrollNext: carouselState.scrollNext, scrollPrev: carouselState.scrollPrev},
    ],
}))

describe('BlockchainExplorer', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
        vi.clearAllMocks()
    })

    it('stops auto-scroll and exposes explicit keyboard controls', async () => {
        const user = userEvent.setup()
        render(<BlockchainExplorer />)

        expect(carouselState.autoScroll).not.toHaveBeenCalled()
        expect(screen.getAllByRole('article')).toHaveLength(BLOCKCHAIN_NETWORKS.length)

        await user.click(screen.getByRole('button', {name: 'Afficher les réseaux précédents'}))
        await user.click(screen.getByRole('button', {name: 'Afficher les réseaux suivants'}))

        expect(carouselState.scrollPrev).toHaveBeenCalledOnce()
        expect(carouselState.scrollNext).toHaveBeenCalledOnce()
    })
})
