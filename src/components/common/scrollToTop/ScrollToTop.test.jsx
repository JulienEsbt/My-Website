import {render, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {MemoryRouter} from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'

describe('ScrollToTop', () => {
    let animationFrameSpy

    beforeEach(() => {
        window.scrollTo.mockClear()
        HTMLElement.prototype.scrollIntoView.mockClear()
        animationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback) => {
                callback()
                return 1
            })
    })

    afterEach(() => {
        animationFrameSpy.mockRestore()
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

    it('waits for a lazy route to render its anchor', async () => {
        render(
            <MemoryRouter initialEntries={['/travel#stories']}>
                <ScrollToTop />
            </MemoryRouter>
        )

        const target = document.createElement('section')
        target.id = 'stories'
        document.body.append(target)

        await waitFor(() =>
            expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({block: 'start'})
        )
        target.remove()
    })
})
