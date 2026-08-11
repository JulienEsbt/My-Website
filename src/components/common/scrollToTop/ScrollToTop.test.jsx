import {render} from '@testing-library/react'
import {beforeEach, describe, expect, it} from 'vitest'
import {MemoryRouter} from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'

describe('ScrollToTop', () => {
    beforeEach(() => {
        window.scrollTo.mockClear()
        HTMLElement.prototype.scrollIntoView.mockClear()
    })

    it('scrolls to the requested anchor', () => {
        render(
            <MemoryRouter initialEntries={['/#contact']}>
                <div id="contact" />
                <ScrollToTop />
            </MemoryRouter>
        )

        expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({block: 'start'})
        expect(window.scrollTo).not.toHaveBeenCalled()
    })

    it('returns to the top when a route has no anchor', () => {
        render(
            <MemoryRouter initialEntries={['/travel']}>
                <ScrollToTop />
            </MemoryRouter>
        )

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
    })
})
