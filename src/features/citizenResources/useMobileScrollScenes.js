import {useEffect, useState} from 'react'

// Native touch scrolling holds each readable block briefly; no touch interception.
export default function useMobileScrollScenes(ref, continuous) {
    const [eligible, setEligible] = useState(false)
    useEffect(() => {
        const root = ref.current
        if (!root || !window.ResizeObserver) return
        const media = matchMedia('(max-width: 1099px) and (prefers-reduced-motion: no-preference)')
        const panels = [...root.querySelectorAll('[data-mobile-scene]')]
        let width = innerWidth
        let viewportHeight = innerHeight
        let frame = 0
        let enabled = []
        const clear = () =>
            panels.forEach((panel) => {
                panel.classList.remove('civic-mobile-scene--animated')
                panel.style.removeProperty('--mobile-scene-height')
                panel.style.removeProperty('--mobile-scene-distance')
                panel.style.removeProperty('--mobile-scene-progress')
            })
        const update = () => {
            frame = 0
            const values = enabled.map((panel) => {
                const progress = Math.max(
                    0,
                    Math.min(1, (160 - panel.getBoundingClientRect().top) / (viewportHeight * 0.4))
                )
                return [panel, progress * progress * (3 - 2 * progress)]
            })
            values.forEach(([panel, progress]) =>
                panel.style.setProperty('--mobile-scene-progress', String(progress))
            )
        }
        const schedule = () => {
            if (!frame && enabled.length) frame = requestAnimationFrame(update)
        }
        const measure = () => {
            // Browser chrome changing height must not change the scroll distance mid-gesture.
            if (width !== innerWidth) {
                width = innerWidth
                viewportHeight = innerHeight
            }
            const heights = panels.map((panel) => panel.firstElementChild.offsetHeight)
            clear()
            const fitting = media.matches
                ? panels.filter((panel, index) => {
                      const height = heights[index]
                      if (height > viewportHeight - 196 || height < 1) return false
                      if (!continuous) {
                          panel.style.setProperty('--mobile-scene-height', `${height}px`)
                          panel.style.setProperty(
                              '--mobile-scene-distance',
                              `${viewportHeight * 0.4}px`
                          )
                          panel.classList.add('civic-mobile-scene--animated')
                      }
                      return true
                  })
                : []
            enabled = continuous ? [] : fitting
            setEligible(fitting.length > 0)
            update()
        }
        const observer = new ResizeObserver(measure)
        panels.forEach((panel) => observer.observe(panel.firstElementChild))
        media.addEventListener('change', measure)
        window.addEventListener('resize', measure)
        window.addEventListener('scroll', schedule, {passive: true})
        measure()
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
            media.removeEventListener('change', measure)
            window.removeEventListener('resize', measure)
            window.removeEventListener('scroll', schedule)
            clear()
        }
    }, [ref, continuous])
    return eligible
}
