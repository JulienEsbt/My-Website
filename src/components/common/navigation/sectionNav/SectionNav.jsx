import React, {useEffect, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {getPreferredScrollBehavior} from '../../accessibility/motionPreferences.js'
import useReducedMotion from '../../accessibility/useReducedMotion.js'
import './SectionNav.css'

const SectionNav = ({items, ariaLabel = 'Section navigation'}) => {
    const navRef = useRef(null)
    const [active, setActive] = useState(`#${items[0]?.id ?? 'top'}`)
    const [dismissedTooltip, setDismissedTooltip] = useState(null)
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        if (!navRef.current) return

        if (reducedMotion) {
            gsap.set(navRef.current, {clearProps: 'all'})
            return undefined
        }

        const tween = gsap.fromTo(
            navRef.current,
            {
                y: 24,
                opacity: 0,
                scale: 0.92,
                filter: 'blur(10px)',
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.75,
                delay: 1.25,
                ease: 'power3.out',
            }
        )

        return () => tween.kill()
    }, [reducedMotion])

    useEffect(() => {
        const handleScroll = () => {
            const sections = items
                .map((item) => ({
                    id: item.id,
                    element: document.getElementById(item.id),
                }))
                .filter((section) => section.element)

            const scrollPosition = window.scrollY + 250
            let current = `#${items[0]?.id ?? 'top'}`

            sections.forEach((section) => {
                if (scrollPosition >= section.element.offsetTop) {
                    current = `#${section.id}`
                }
            })

            setActive(current)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [items])

    const handleClick = (id) => (event) => {
        event.preventDefault()

        const target = document.getElementById(id)
        if (!target) return

        const offset = 30

        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - offset,
            behavior: getPreferredScrollBehavior(),
        })

        setActive(`#${id}`)
    }

    return (
        <nav ref={navRef} className="section-nav" aria-label={ariaLabel}>
            {items.map((item) => {
                const hash = `#${item.id}`

                return (
                    <a
                        key={item.id}
                        href={hash}
                        className={active === hash ? 'active' : ''}
                        aria-label={item.label}
                        aria-current={active === hash ? 'location' : undefined}
                        data-label={item.label}
                        data-tooltip-dismissed={dismissedTooltip === item.id ? 'true' : undefined}
                        onClick={handleClick(item.id)}
                        onFocus={() => setDismissedTooltip(null)}
                        onPointerEnter={() => setDismissedTooltip(null)}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                event.preventDefault()
                                setDismissedTooltip(item.id)
                            }
                        }}
                    >
                        <span aria-hidden="true">{item.icon}</span>
                    </a>
                )
            })}
        </nav>
    )
}

export default SectionNav
