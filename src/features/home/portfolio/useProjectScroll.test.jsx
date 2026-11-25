import {act, renderHook} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, expect, it, vi} from 'vitest'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useProjectScroll from './useProjectScroll.js'

vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {refresh: vi.fn()}}))

afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
})

it('refreshes following sections when enhancement collapses projects without enabling sticky scrolling', () => {
    vi.stubGlobal('innerHeight', 900)
    vi.stubGlobal('requestAnimationFrame', (callback) => {
        callback()
        return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            disconnect() {}
        }
    )
    const scene = {current: document.createElement('div')}
    const stage = {current: document.createElement('div')}
    // This card is taller than the available scene, so scrolling stays disabled.
    Object.defineProperty(stage.current, 'offsetHeight', {value: 800})
    const onSelect = vi.fn()
    const {result, rerender} = renderHook(
        ({enabled}) =>
            useProjectScroll({scene, stage, enabled, count: 6, selected: 0, onSelect, hash: ''}),
        {
            initialProps: {enabled: false},
            wrapper: ({children}) => <MemoryRouter>{children}</MemoryRouter>,
        }
    )
    expect(result.current.scrolling).toBe(false)
    vi.mocked(ScrollTrigger.refresh).mockClear()

    act(() => rerender({enabled: true}))

    expect(result.current.scrolling).toBe(false)
    expect(ScrollTrigger.refresh).toHaveBeenCalledOnce()
})

it('ignores a resize notification after the portfolio refs are cleared', () => {
    let notifyResize
    vi.stubGlobal(
        'ResizeObserver',
        class {
            constructor(callback) {
                notifyResize = callback
            }
            observe() {}
            disconnect() {}
        }
    )
    const scene = {current: document.createElement('div')}
    const stage = {current: document.createElement('div')}
    renderHook(
        () =>
            useProjectScroll({
                scene,
                stage,
                enabled: true,
                count: 6,
                selected: 0,
                onSelect: vi.fn(),
            }),
        {wrapper: MemoryRouter}
    )

    // Refs are cleared during commit, before the effect disconnects the observer.
    scene.current = null
    stage.current = null
    expect(() => notifyResize()).not.toThrow()
})
