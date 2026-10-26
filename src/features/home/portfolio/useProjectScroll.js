import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {desktopScenePlacement} from '../../../components/common/layout/viewport/sceneViewport.js'

export default function useProjectScroll({scene, stage, enabled, count, selected, onSelect, hash}) {
    const [fits, setFits] = useState(false)
    const [reading, setReading] = useState(false)
    const metrics = useRef({top: 96, distance: 1})
    const selection = useRef(selected)
    const change = useRef(onSelect)
    const restoreTop = useRef(null)
    const lastStageTop = useRef(null)
    const pending = useRef(null)
    const timer = useRef(0)
    selection.current = selected
    change.current = onSelect
    const scrolling = enabled && fits && !reading

    useEffect(() => {
        if (!enabled || !scene.current || !stage.current) return undefined
        const measure = () => {
            const height = stage.current.offsetHeight
            const placement = desktopScenePlacement(height)
            const root = scene.current
            if (height <= 0 || !placement.fits) {
                // Keep the last fitted top while releasing a card into document flow.
                if (root.dataset.scrollEnabled === 'true' && restoreTop.current === null)
                    restoreTop.current = lastStageTop.current ?? metrics.current.top
                setFits(false)
                return
            }
            const distance = innerHeight * 0.72
            metrics.current = {top: placement.top, distance}
            root.style.setProperty('--project-top', `${placement.top}px`)
            root.style.setProperty('--project-stage-height', `${height}px`)
            root.style.setProperty('--project-step-distance', `${distance}px`)
            root.style.setProperty('--project-travel', `${distance * (count - 0.55)}px`)
            setFits(true)
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
        if (!scrolling && restoreTop.current !== null && stage.current) {
            window.scrollBy({
                top: stage.current.getBoundingClientRect().top - restoreTop.current,
                behavior: 'instant',
            })
            restoreTop.current = null
        }
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh?.())
        return () => cancelAnimationFrame(frame)
    }, [scrolling, stage])

    const moveTo = useCallback(
        (index, behavior) => {
            const root = scene.current
            if (!root) return
            pending.current = index
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                pending.current = null
            }, 1500)
            window.scrollTo({
                top:
                    scrollY +
                    root.getBoundingClientRect().top -
                    metrics.current.top +
                    metrics.current.distance * index,
                behavior,
            })
        },
        [scene]
    )

    const selectProject = useCallback(
        (index) => {
            change.current(index)
            if (scrolling) moveTo(index, 'smooth')
        },
        [scrolling, moveTo]
    )

    const readContinuously = useCallback(() => {
        if (!scrolling) return
        restoreTop.current = stage.current.getBoundingClientRect().top
        window.scrollTo({top: window.scrollY, left: window.scrollX, behavior: 'instant'})
        setReading(true)
    }, [scrolling, stage])

    useEffect(() => {
        if (!scrolling) return undefined
        let frame = 0,
            first = 0,
            second = 0,
            restoring = true
        const update = () => {
            frame = 0
            if (restoring || document.body.style.position === 'fixed') return
            const root = scene.current
            if (!root) return
            lastStageTop.current = stage.current.getBoundingClientRect().top
            const bounds = root.getBoundingClientRect()
            const {top, distance} = metrics.current
            if (bounds.top > top + 2 || bounds.bottom < top) return
            const position = (top - bounds.top) / distance
            if (pending.current !== null) {
                if (Math.abs(position - pending.current) > 0.02) return
                pending.current = null
            }
            const index = Math.max(0, Math.min(count - 1, Math.round(position)))
            if (index === selection.current) return
            const panel = root.querySelector('[role="tabpanel"]:not([hidden])')
            if (panel?.contains(document.activeElement))
                root.querySelectorAll('[role="tab"]')[index]?.focus({preventScroll: true})
            change.current(index)
        }
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        const cancelPending = (event) => {
            if (event.type === 'keydown' && event.target.closest?.('.portfolio__index')) return
            pending.current = null
        }
        first = requestAnimationFrame(() => {
            second = requestAnimationFrame(() => {
                const bounds = scene.current.getBoundingClientRect()
                if (hash && selection.current > 0 && bounds.top < innerHeight && bounds.bottom > 0)
                    moveTo(selection.current, 'instant')
                restoring = false
                schedule()
            })
        })
        window.addEventListener('scroll', schedule, {passive: true})
        window.addEventListener('wheel', cancelPending, {passive: true})
        window.addEventListener('touchstart', cancelPending, {passive: true})
        window.addEventListener('keydown', cancelPending)
        return () => {
            cancelAnimationFrame(frame)
            cancelAnimationFrame(first)
            cancelAnimationFrame(second)
            clearTimeout(timer.current)
            pending.current = null
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('wheel', cancelPending)
            window.removeEventListener('touchstart', cancelPending)
            window.removeEventListener('keydown', cancelPending)
        }
    }, [scrolling, count, scene, stage, hash, moveTo])

    return {scrolling, selectProject, readContinuously}
}
