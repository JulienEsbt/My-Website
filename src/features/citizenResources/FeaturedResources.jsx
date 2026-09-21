import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiArrowDown} from 'react-icons/fi'
import {citizenResources} from '../../data/citizenResources/resources.js'
import ResourceCard from './ResourceCard.jsx'

const resources = citizenResources.filter((resource) => resource.featured)
const clamp = (value) => Math.max(0, Math.min(1, value))

export default function FeaturedResources() {
    const {t} = useTranslation('resources')
    const rootRef = useRef(null)
    const pendingTarget = useRef(null)
    const [eligible, setEligible] = useState(false)
    const [continuous, setContinuous] = useState(false)
    const [active, setActive] = useState(0)
    const animated = eligible && !continuous

    useEffect(() => {
        const root = rootRef.current
        const media = matchMedia(
            '(min-width: 1100px) and (min-height: 850px) and (prefers-reduced-motion: no-preference)'
        )
        // A full card must fit without an inner scrollbar, including larger text/zoom.
        const measure = () => {
            const height = Math.max(
                ...Array.from(root.querySelectorAll('.civic-card'), (card) => card.offsetHeight)
            )
            root.style.setProperty('--scene-height', `${height + 128}px`)
            const next = media.matches && height + 128 < innerHeight - 120
            const bounds = root.getBoundingClientRect()
            if (
                !next &&
                root.classList.contains('civic-scene--animated') &&
                bounds.top < innerHeight &&
                bounds.bottom > 100
            ) {
                pendingTarget.current = root.querySelector(
                    '.civic-scene__panel[aria-hidden="false"] article'
                )
            }
            setEligible(next)
        }
        const observer = new ResizeObserver(measure)
        root.querySelectorAll('.civic-card').forEach((card) => observer.observe(card))
        media.addEventListener('change', measure)
        window.addEventListener('resize', measure)
        measure()
        return () => {
            observer.disconnect()
            media.removeEventListener('change', measure)
            window.removeEventListener('resize', measure)
        }
    }, [])

    useEffect(() => {
        const root = rootRef.current
        const panels = Array.from(root.querySelectorAll('.civic-scene__panel'))
        if (!animated) {
            if (pendingTarget.current) {
                pendingTarget.current.scrollIntoView({block: 'start', behavior: 'instant'})
                pendingTarget.current = null
            }
            return
        }
        let frame = 0
        let previous = -1
        const update = () => {
            frame = 0
            const distance = innerHeight * 0.72
            const position = Math.max(
                0,
                Math.min(resources.length - 1, (100 - root.getBoundingClientRect().top) / distance)
            )
            const base = Math.floor(position)
            // Hold the reading position, then ease the complete panel into the next one.
            const progress = clamp((position - base - 0.28) / 0.58)
            const eased = progress * progress * (3 - 2 * progress)
            const current = Math.min(resources.length - 1, base + (eased >= 0.5 ? 1 : 0))
            panels.forEach((panel, index) => {
                const incoming = index === base + 1
                const fadeOut = clamp(progress * 2)
                const fadeIn = clamp((progress - 0.5) * 2)
                const opacity =
                    index === base
                        ? 1 - fadeOut * fadeOut * (3 - 2 * fadeOut)
                        : incoming
                          ? fadeIn * fadeIn * (3 - 2 * fadeIn)
                          : 0
                const offset = index === base ? -24 * eased : 40 * (1 - eased)
                if (index !== current && panel.contains(document.activeElement)) {
                    root.querySelectorAll('.civic-scene__steps button')[current]?.focus({
                        preventScroll: true,
                    })
                }
                panel.inert = index !== current
                panel.setAttribute('aria-hidden', String(index !== current))
                panel.style.opacity = String(opacity)
                panel.style.visibility = opacity > 0 ? 'visible' : 'hidden'
                panel.style.transform = `translateY(${offset}px) scale(${0.985 + 0.015 * opacity})`
                panel.style.zIndex = index === current ? '2' : '1'
            })
            if (previous !== current) {
                previous = current
                setActive(current)
            }
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
                panel.removeAttribute('style')
            })
        }
    }, [animated])

    useEffect(() => {
        const followHash = () => {
            const target = document.getElementById(location.hash.slice(1))
            if (!target || !rootRef.current.contains(target)) return
            pendingTarget.current = target
            setContinuous(true)
        }
        followHash()
        window.addEventListener('hashchange', followHash)
        return () => window.removeEventListener('hashchange', followHash)
    }, [])

    const select = (index) => {
        const top =
            scrollY + rootRef.current.getBoundingClientRect().top - 100 + index * innerHeight * 0.72
        window.scrollTo({top, behavior: 'instant'})
    }
    const readContinuously = (target) => {
        pendingTarget.current = target || rootRef.current.querySelectorAll('.civic-card')[active]
        setContinuous(true)
    }

    return (
        <div ref={rootRef} className={`civic-scene ${animated ? 'civic-scene--animated' : ''}`}>
            <div className="civic-scene__stage">
                {eligible && (
                    <div className="civic-scene__toolbar">
                        {animated && (
                            <span>
                                <FiArrowDown aria-hidden="true" />
                                {t('featured.scene.hint')}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (animated) readContinuously()
                                else {
                                    setContinuous(false)
                                    rootRef.current.scrollIntoView({
                                        block: 'start',
                                        behavior: 'instant',
                                    })
                                }
                            }}
                        >
                            {t(`featured.scene.${animated ? 'continuous' : 'animated'}`)}
                        </button>
                    </div>
                )}
                {animated && (
                    <nav className="civic-scene__steps" aria-label={t('featured.scene.label')}>
                        {resources.map((resource, index) => (
                            <button
                                type="button"
                                key={resource.id}
                                aria-current={active === index ? 'step' : undefined}
                                onClick={() => select(index)}
                            >
                                <span aria-hidden="true">0{index + 1}</span>
                                {resource.name}
                            </button>
                        ))}
                    </nav>
                )}
                <div
                    className="civic-scene__panels"
                    onClickCapture={(event) => {
                        // Sources expand in normal document flow, with the focused control preserved.
                        if (animated && event.target.closest('summary'))
                            readContinuously(event.target.closest('article'))
                    }}
                >
                    {resources.map((resource, index) => (
                        <div className="civic-scene__panel" key={resource.id}>
                            <ResourceCard resource={resource} number={index + 1} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
