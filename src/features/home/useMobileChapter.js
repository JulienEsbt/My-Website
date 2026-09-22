import {useLayoutEffect, useState} from 'react'

// Keep native touch scrolling: each complete card pauses, then releases normally.
export default function useMobileChapter(sectionRef) {
    const [continuous, setContinuous] = useState(false)
    const [available, setAvailable] = useState(false)
    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section) return undefined
        const media = matchMedia('(max-width: 1099px) and (prefers-reduced-motion: no-preference)')
        const steps = [...section.querySelectorAll('.professional-chapter__step')]
        let width = innerWidth
        let height = innerHeight
        let frame = 0
        let active = []
        const clear = () =>
            steps.forEach((step) => {
                step.classList.remove('professional-chapter__step--mobile')
                step.style.removeProperty('--mobile-hold')
                step.style.removeProperty('--mobile-card-height')
                step.style.removeProperty('--mobile-scale')
            })
        const update = () => {
            frame = 0
            const values = active.map((step) => {
                const progress = Math.max(
                    0,
                    Math.min(1, (88 - step.getBoundingClientRect().top) / (height * 0.45))
                )
                return [step, 0.96 + 0.04 * progress * progress * (3 - 2 * progress)]
            })
            values.forEach(([step, scale]) =>
                step.style.setProperty('--mobile-scale', String(scale))
            )
        }
        const schedule = () => {
            if (!frame && active.length) frame = requestAnimationFrame(update)
        }
        const measure = () => {
            const heights = steps.map((step) => step.firstElementChild.offsetHeight)
            clear()
            const fitting =
                media.matches && height > width
                    ? steps.filter(
                          (step, index) => heights[index] > 0 && heights[index] <= height - 180
                      )
                    : []
            active = continuous ? [] : fitting
            active.forEach((step) => {
                step.style.setProperty('--mobile-hold', `${height * 0.45}px`)
                step.style.setProperty('--mobile-card-height', `${heights[steps.indexOf(step)]}px`)
                step.classList.add('professional-chapter__step--mobile')
            })
            setAvailable(fitting.length > 0)
            update()
        }
        const resize = () => {
            // Safari's address bar must not change the travel distance mid-gesture.
            if (innerWidth === width) return
            width = innerWidth
            height = innerHeight
            measure()
        }
        const observer = new ResizeObserver(measure)
        steps.forEach((step) => observer.observe(step.firstElementChild))
        media.addEventListener('change', measure)
        window.addEventListener('resize', resize)
        window.addEventListener('scroll', schedule, {passive: true})
        measure()
        return () => {
            observer.disconnect()
            media.removeEventListener('change', measure)
            window.removeEventListener('resize', resize)
            window.removeEventListener('scroll', schedule)
            cancelAnimationFrame(frame)
            clear()
        }
    }, [sectionRef, continuous])
    return {available, continuous, toggle: () => setContinuous((value) => !value)}
}
