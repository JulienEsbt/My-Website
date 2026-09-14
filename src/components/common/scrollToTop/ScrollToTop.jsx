import {useEffect} from 'react'
import {unlocalizedPath} from '../../../config/localizedPaths.js'
import {useLocation} from 'react-router-dom'

const ScrollToTop = () => {
    const {pathname: localizedPathname, hash} = useLocation()
    const pathname = unlocalizedPath(localizedPathname)

    useEffect(() => {
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
    }, [pathname, hash])

    return null
}

export default ScrollToTop
