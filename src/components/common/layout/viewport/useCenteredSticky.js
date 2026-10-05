import {useLayoutEffect} from 'react'
import {desktopScenePlacement} from './sceneViewport.js'

export default function useCenteredSticky(ref, contentKey) {
    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return undefined
        const update = () => {
            const {top, fits} = desktopScenePlacement(element.offsetHeight)
            element.style.setProperty('--sticky-center-top', `${top}px`)
            element.dataset.fitsViewport = String(fits)
        }
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
        observer?.observe(element)
        window.addEventListener('resize', update)
        update()
        return () => {
            observer?.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [ref, contentKey])
}
