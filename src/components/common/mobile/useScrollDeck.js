import {useEffect, useLayoutEffect, useRef, useState} from 'react'

// A native sticky scene: observing the page never cancels wheel or touch events.
export default function useScrollDeck({scene, stage, track, enabled, count}) {
    const [fits, setFits] = useState(false)
    const [manual, setManual] = useState(false)
    const metrics = useRef({top: 80, distance: 1})
    const restoreTop = useRef(null)
    const currentCard = useRef(0)
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

    useLayoutEffect(() => {
        if (!animated) {
            const element = track.current
            if (element && currentCard.current) {
                const card = element.children[currentCard.current]
                if (card) element.scrollLeft = card.offsetLeft - element.children[0].offsetLeft
            }
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
        const panels = Array.from(track.current.children)
        track.current.scrollLeft = 0
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
            currentCard.current = Math.min(count - 1, base + (eased >= 0.5 ? 1 : 0))
            panels.forEach((panel, index) => {
                const outgoing = index === base
                const incoming = index === base + 1
                const opacity = outgoing ? 1 - 0.7 * eased : incoming && eased > 0 ? 1 : 0
                const offset = outgoing ? -18 * eased : 28 * (1 - eased)
                const scale = outgoing ? 1 - 0.075 * eased : 0.94 + 0.06 * eased
                const tilt = outgoing ? 3 * eased : -3 * (1 - eased)
                panel.style.opacity = String(opacity)
                panel.style.visibility = opacity > 0 ? 'visible' : 'hidden'
                panel.style.transform = `perspective(900px) translateY(${offset}px) rotateX(${tilt}deg) scale(${scale})`
                panel.style.zIndex = incoming ? '2' : '1'
                panel.style.clipPath = incoming
                    ? `inset(${(1 - eased) * 100}% 0 0 0 round 1.4rem)`
                    : 'none'
                panel.inert = index !== currentCard.current
                panel.setAttribute('aria-hidden', String(index !== currentCard.current))
            })
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
            panels.forEach((panel) => {
                panel.inert = false
                panel.removeAttribute('aria-hidden')
                for (const property of [
                    'opacity',
                    'visibility',
                    'transform',
                    'z-index',
                    'clip-path',
                ])
                    panel.style.removeProperty(property)
            })
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
    return {animated, release}
}
