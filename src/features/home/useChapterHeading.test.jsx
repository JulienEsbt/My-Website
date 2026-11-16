import {act, renderHook} from '@testing-library/react'
import {afterEach, expect, it, vi} from 'vitest'
import useChapterHeading from './useChapterHeading.js'

vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {refresh: vi.fn()}}))

afterEach(() => {
    vi.unstubAllGlobals()
    delete document.fonts
})

it('measures each height before updating styles and keeps translated cards centered on resize', () => {
    let resized
    vi.stubGlobal(
        'ResizeObserver',
        class {
            constructor(callback) {
                resized = callback
            }
            observe() {}
            disconnect() {}
        }
    )
    Object.defineProperty(document, 'fonts', {
        configurable: true,
        value: {ready: Promise.resolve()},
    })
    const section = document.createElement('section')
    section.innerHTML = `<div class="professional-chapter__heading"><h2>Heading</h2></div>
        <div class="professional-chapter__step"><article>First card</article></div>
        <div class="professional-chapter__step"><article>Second card</article></div>`
    const heading = section.querySelector('h2')
    const cards = [...section.querySelectorAll('article')]
    const heights = [120, 310, 280]
    const events = []
    ;[heading, ...cards].forEach((element, index) => {
        Object.defineProperty(element, 'offsetHeight', {
            get: () => {
                events.push('read')
                return heights[index]
            },
        })
    })
    ;[heading.parentElement, section, ...cards.map((card) => card.parentElement)].forEach(
        (element) => {
            const setProperty = element.style.setProperty.bind(element.style)
            vi.spyOn(element.style, 'setProperty').mockImplementation((...args) => {
                events.push('write')
                return setProperty(...args)
            })
        }
    )
    renderHook(() => useChapterHeading({current: section}))
    expect(events.filter((event) => event === 'read')).toHaveLength(3)
    expect(events.slice(events.indexOf('write'))).not.toContain('read')
    expect(section.style.getPropertyValue('--stage-height')).toBe('310px')
    heights[2] = 420
    act(() => resized())
    expect(section.style.getPropertyValue('--stage-height')).toBe('420px')
    expect(cards[1].parentElement.style.getPropertyValue('--panel-height')).toBe('420px')
})
