import {useEffect} from 'react'

// Progressive enhancement: the document is always visible, even without observers or JS.
export default function useCivicMotion(ref) {
    useEffect(() => {
        const root = ref.current
        if (!root || !window.IntersectionObserver || !Element.prototype.animate) return
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
        const played = new WeakSet()
        const animations = new Map()
        let observer
        const stop = () => {
            observer?.disconnect()
            animations.forEach((animation) => animation.cancel())
            animations.clear()
        }
        const configure = () => {
            stop()
            if (preference.matches) return
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(({target, isIntersecting}) => {
                        if (!isIntersecting || preference.matches || !root.isConnected) return
                        observer.unobserve(target)
                        played.add(target)
                        if (target.contains(document.activeElement)) return
                        const animation = target.animate(
                            [
                                {opacity: 0.55, transform: 'translateY(28px)'},
                                {opacity: 1, transform: 'translateY(0)'},
                            ],
                            {duration: 760, easing: 'cubic-bezier(0.16, 1, 0.3, 1)'}
                        )
                        animations.set(target, animation)
                        animation.onfinish = () => animations.delete(target)
                    })
                },
                {threshold: 0, rootMargin: '0px 0px -24px 0px'}
            )
            root.querySelectorAll('[data-civic-reveal]').forEach((target) => {
                // Do not animate restored scroll positions or replay content when scrolling back.
                if (played.has(target) || target.getBoundingClientRect().top < innerHeight - 24)
                    return
                observer.observe(target)
            })
        }
        const showFocused = (event) => {
            animations.forEach((animation, target) => {
                if (target.contains(event.target)) {
                    animation.cancel()
                    animations.delete(target)
                }
            })
        }
        configure()
        preference.addEventListener('change', configure)
        root.addEventListener('focusin', showFocused)
        return () => {
            stop()
            preference.removeEventListener('change', configure)
            root.removeEventListener('focusin', showFocused)
        }
    }, [ref])
}
