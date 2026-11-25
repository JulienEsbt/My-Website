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
