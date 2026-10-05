import {useEffect, useRef, useState} from 'react'

// A native sticky scene: observing the page never cancels wheel or touch events.
export default function useScrollDeck({scene, stage, track, enabled, count}) {
    const [fits, setFits] = useState(false)
    const [manual, setManual] = useState(false)
    const metrics = useRef({top: 80, distance: 1})
    const restoreTop = useRef(null)
    const animated = enabled && fits && !manual

    useEffect(() => {
        if (!enabled || !scene.current || !stage.current) return
        let width = innerWidth
        let height = innerHeight
        const measure = () => {
            if (width !== innerWidth) {
                width = innerWidth
                height = innerHeight
            }
            const dock = document.querySelector('.section-nav')
            const bottom = (dock?.offsetHeight || 64) + 30
            const stageHeight = stage.current.offsetHeight
            const available = height - 80 - bottom
            metrics.current = {top: 80, distance: height * 0.72}
            scene.current.style.setProperty('--scroll-deck-height', `${stageHeight}px`)
            scene.current.style.setProperty(
                '--scroll-deck-travel',
                `${height * 0.72 * (count - 1)}px`
            )
            setFits(stageHeight > 0 && stageHeight <= available)
        }
        const observer = new ResizeObserver(measure)
        observer.observe(stage.current)
        window.addEventListener('resize', measure)
        measure()
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [enabled, count, scene, stage])

    useEffect(() => {
        if (!animated) {
            if (restoreTop.current !== null && stage.current) {
                window.scrollBy({
                    top: stage.current.getBoundingClientRect().top - restoreTop.current,
                    behavior: 'instant',
                })
                restoreTop.current = null
            }
            return
        }
        let frame = 0
        const update = () => {
            frame = 0
            const element = track.current
            if (!element || !scene.current) return
            const position = Math.max(
                0,
                Math.min(
                    count - 1,
                    (metrics.current.top - scene.current.getBoundingClientRect().top) /
                        metrics.current.distance
                )
            )
            const base = Math.floor(position)
            const progress = Math.max(0, Math.min(1, (position - base - 0.45) / 0.5))
            const eased = progress * progress * (3 - 2 * progress)
            const first = element.children[0]
            const next = element.children[1]
            const stride = next ? next.offsetLeft - first.offsetLeft : 0
            element.scrollLeft = (base + eased) * stride
        }
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        update()
        window.addEventListener('scroll', schedule, {passive: true})
        window.addEventListener('resize', schedule)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
        }
    }, [animated, count, scene, stage, track])

    useEffect(() => {
        const followHash = () => {
            const target = document.getElementById(location.hash.slice(1))
            if (target && scene.current?.contains(target)) {
                if (animated) restoreTop.current = stage.current.getBoundingClientRect().top
                setManual(true)
            }
        }
        followHash()
        window.addEventListener('hashchange', followHash)
        return () => window.removeEventListener('hashchange', followHash)
    }, [animated, scene, stage])

    const release = () => {
        if (!animated) return
        restoreTop.current = stage.current.getBoundingClientRect().top
        setManual(true)
    }
    const select = (index) => {
        window.scrollTo({
            top:
                scrollY +
                scene.current.getBoundingClientRect().top -
                metrics.current.top +
                index * metrics.current.distance,
            behavior: 'instant',
        })
    }
    return {animated, release, select}
}
