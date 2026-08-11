import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

const ScrollToTop = () => {
    const {pathname, hash} = useLocation()

    useEffect(() => {
        if (hash) {
            const targetId = decodeURIComponent(hash.slice(1))
            let observer

            const scrollToTarget = () => {
                const target = document.getElementById(targetId)
                if (!target) return false

                target.scrollIntoView({block: 'start'})
                observer?.disconnect()
                return true
            }

            const frame = window.requestAnimationFrame(() => {
                if (scrollToTarget()) return

                observer = new MutationObserver(scrollToTarget)
                observer.observe(document.body, {childList: true, subtree: true})
            })

            const timeout = window.setTimeout(() => observer?.disconnect(), 2000)

            return () => {
                window.cancelAnimationFrame(frame)
                window.clearTimeout(timeout)
                observer?.disconnect()
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
