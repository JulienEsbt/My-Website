import {useEffect, useRef} from 'react'
import {unlocalizedPath} from '../../../config/localizedPaths.js'
import {useLocation, useNavigationType} from 'react-router-dom'

const ScrollToTop = () => {
    const {pathname: localizedPathname, hash, key, state} = useLocation()
    const navigationType = useNavigationType()
    const previousLocation = useRef(null)
    const pathname = unlocalizedPath(localizedPathname)

    useEffect(() => {
        const previous = previousLocation.current
        previousLocation.current = {pathname, hash, key, origin: state?.travelTimelineOrigin}
        // Language switches keep the same document position.
        if (previous?.pathname === pathname && previous?.hash === hash) return
        const isTravel = (path) => path === '/travel' || path?.startsWith('/travel/')
        if (
            previous &&
            isTravel(previous.pathname) &&
            isTravel(pathname) &&
            (state?.travelTimelineOrigin || (navigationType === 'POP' && previous.origin === key))
        ) {
            // The mobile dialog's body lock restores the list, including browser Back.
            return
        }
        if (hash) {
            const targetId = decodeURIComponent(hash.slice(1))
            let observer
            let stopped = false
            const stop = () => {
                stopped = true
            }
            const resize = new ResizeObserver(() => {
                if (!stopped) scrollToTarget()
            })

            const scrollToTarget = () => {
                const target = document.getElementById(targetId)
                if (!target || stopped || target.closest('#prerendered-content')) return false

                target.scrollIntoView({block: 'start'})
                observer?.disconnect()
                return true
            }

            const frame = window.requestAnimationFrame(() => {
                if (scrollToTarget()) return

                observer = new MutationObserver(scrollToTarget)
                observer.observe(document.body, {childList: true, subtree: true})
            })

            resize.observe(document.body)
            window.addEventListener('wheel', stop, {passive: true})
            window.addEventListener('touchstart', stop, {passive: true})
            window.addEventListener('keydown', stop)
            const timeout = window.setTimeout(() => {
                stop()
                observer?.disconnect()
                resize.disconnect()
            }, 2000)

            return () => {
                window.cancelAnimationFrame(frame)
                window.clearTimeout(timeout)
                observer?.disconnect()
                resize.disconnect()
                window.removeEventListener('wheel', stop)
                window.removeEventListener('touchstart', stop)
                window.removeEventListener('keydown', stop)
            }
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
    }, [pathname, hash, key, state?.travelTimelineOrigin, navigationType])

    return null
}

export default ScrollToTop
