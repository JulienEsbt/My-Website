import {useEffect} from 'react'

// A light scroll reveal in normal document flow; no pinning or hidden content.
export default function useCivicFocus(ref) {
    useEffect(() => {
        const root = ref.current
        if (!root || !window.IntersectionObserver) return
        const media = window.matchMedia(
            '(min-width: 851px) and (prefers-reduced-motion: no-preference)'
        )
        const targets = [...root.querySelectorAll('[data-civic-focus]')]
        const visible = new Set()
        let observer
        let frame = 0
        const update = () => {
            frame = 0
            const height = window.innerHeight
            const values = [...visible].map((target) => {
                const top = target.getBoundingClientRect().top
                const progress = target.contains(document.activeElement)
                    ? 1
                    : Math.max(0, Math.min(1, (height * 0.92 - top) / (height * 0.48)))
                return [target, progress]
            })
            values.forEach(([target, progress]) => {
                target.style.setProperty('--civic-focus', progress.toFixed(3))
            })
        }
        const schedule = () => {
            if (!frame && media.matches) frame = requestAnimationFrame(update)
        }
        const reset = () => {
            observer?.disconnect()
            cancelAnimationFrame(frame)
            frame = 0
            visible.clear()
            targets.forEach((target) => target.style.removeProperty('--civic-focus'))
            root.classList.remove('civic-page--focus-motion')
        }
        const configure = () => {
            reset()
            if (!media.matches) return
            root.classList.add('civic-page--focus-motion')
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(({target, isIntersecting}) => {
                        if (isIntersecting) visible.add(target)
                        else visible.delete(target)
                    })
                    schedule()
                },
                {rootMargin: '80px 0px'}
            )
            targets.forEach((target) => observer.observe(target))
        }
        configure()
        media.addEventListener('change', configure)
        window.addEventListener('scroll', schedule, {passive: true})
        window.addEventListener('resize', schedule)
        root.addEventListener('focusin', schedule)
        return () => {
            reset()
            media.removeEventListener('change', configure)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
            root.removeEventListener('focusin', schedule)
        }
    }, [ref])
}
