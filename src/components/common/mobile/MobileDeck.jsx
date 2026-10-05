import useScrollDeck from './useScrollDeck.js'
import useReducedMotion from '../accessibility/useReducedMotion.js'
import {Children, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiArrowDown, FiArrowLeft, FiArrowRight, FiPause, FiPlay} from 'react-icons/fi'
import useMediaQuery from '../accessibility/useMediaQuery.js'
import {getPreferredScrollBehavior} from '../accessibility/motionPreferences.js'

// Desktop keeps the original DOM. On phones, native scrolling provides momentum,
// keyboard access and vertical page scrolling without intercepting touch gestures.
export default function MobileDeck({children, label, scrollDriven = false}) {
    const mobile = useMediaQuery('(max-width: 700px)')
    const {i18n} = useTranslation()
    const fr = i18n.resolvedLanguage?.startsWith('fr')
    const track = useRef(null)
    const root = useRef(null)
    const scene = useRef(null)
    const gesture = useRef(null)
    const [active, setActive] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [paused, setPaused] = useState(false)
    const [visible, setVisible] = useState(false)
    const reducedMotion = useReducedMotion()
    const cards = Children.toArray(children)
    const scrollScene = useScrollDeck({
        scene,
        stage: root,
        track,
        enabled: mobile && scrollDriven && !expanded && !reducedMotion,
        count: cards.length,
    })
    useEffect(() => {
        if (!mobile || !root.current) return
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.25,
        })
        observer.observe(root.current)
        return () => observer.disconnect()
    }, [mobile])
    useEffect(() => {
        if (
            scrollDriven ||
            !mobile ||
            expanded ||
            paused ||
            !visible ||
            reducedMotion ||
            cards.length < 2
        )
            return
        const timer = setInterval(() => {
            const element = track.current
            if (
                !element ||
                document.hidden ||
                track.current?.contains(document.activeElement) ||
                root.current?.querySelector('details[open]')
            )
                return
            const index = (active + 1) % cards.length
            const card = element.children[index]
            element.scrollTo({
                left:
                    element.scrollLeft +
                    card.getBoundingClientRect().left -
                    element.getBoundingClientRect().left,
                behavior: 'smooth',
            })
        }, 6500)
        return () => clearInterval(timer)
    }, [scrollDriven, mobile, expanded, paused, visible, reducedMotion, active, cards.length])
    useEffect(() => {
        if (!mobile || expanded || !track.current) return
        const element = track.current
        const update = () => {
            const left = element.getBoundingClientRect().left
            let nearest = 0
            let distance = Infinity
            Array.from(element.children).forEach((card, index) => {
                const delta = Math.abs(card.getBoundingClientRect().left - left)
                if (delta < distance) {
                    distance = delta
                    nearest = index
                }
            })
            setActive(nearest)
        }
        element.addEventListener('scroll', update, {passive: true})
        const observer = new ResizeObserver(update)
        observer.observe(element)
        update()
        return () => {
            element.removeEventListener('scroll', update)
            observer.disconnect()
        }
    }, [mobile, expanded, cards.length])
    useEffect(() => {
        if (!mobile || expanded) return
        const followHash = () => {
            const target = document.getElementById(window.location.hash.slice(1))
            const card = target?.closest('.mobile-deck__item')
            const element = track.current
            if (!card || !element?.contains(card)) return
            element.scrollTo({
                left:
                    element.scrollLeft +
                    card.getBoundingClientRect().left -
                    element.getBoundingClientRect().left,
                behavior: 'instant',
            })
        }
        followHash()
        window.addEventListener('hashchange', followHash)
        return () => window.removeEventListener('hashchange', followHash)
    }, [mobile, expanded])
    if (!mobile) return <>{children}</>
    const select = (index) => {
        setPaused(true)
        if (scrollScene.animated) {
            scrollScene.select(index)
            return
        }
        const element = track.current
        const card = element?.children[index]
        if (!card) return
        element.scrollTo({
            left:
                element.scrollLeft +
                card.getBoundingClientRect().left -
                element.getBoundingClientRect().left,
            behavior: getPreferredScrollBehavior(),
        })
    }
    const content = (
        <div
            ref={root}
            className={`mobile-deck ${expanded ? 'mobile-deck--expanded' : ''}`}
            role="region"
            aria-label={label}
        >
            <div className="mobile-deck__toolbar">
                <span>
                    {expanded
                        ? label
                        : scrollScene.animated
                          ? fr
                              ? 'Défilez pour découvrir la suite'
                              : 'Scroll to discover more'
                          : fr
                            ? 'Balayez pour explorer'
                            : 'Swipe to explore'}
                </span>
                <button
                    type="button"
                    aria-pressed={expanded}
                    onClick={() => {
                        setExpanded(!expanded)
                        // Keep the mode control on screen when the document height changes.
                        requestAnimationFrame(() =>
                            root.current?.scrollIntoView({block: 'start', behavior: 'instant'})
                        )
                    }}
                >
                    {expanded
                        ? fr
                            ? 'Vue cartes'
                            : 'Card view'
                        : fr
                          ? 'Tout afficher'
                          : 'Show all'}
                </button>
            </div>
            <div
                ref={track}
                className="mobile-deck__track"
                onClickCapture={(event) => {
                    if (event.target.closest('summary')) scrollScene.release()
                }}
                onFocusCapture={() => scrollScene.release()}
                onPointerDown={(event) => {
                    setPaused(true)
                    gesture.current = {x: event.clientX, y: event.clientY}
                }}
                onPointerMove={(event) => {
                    const start = gesture.current
                    if (
                        start &&
                        Math.abs(event.clientX - start.x) > 12 &&
                        Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)
                    )
                        scrollScene.release()
                }}
                onPointerUp={() => {
                    gesture.current = null
                }}
                onPointerCancel={() => {
                    gesture.current = null
                }}
            >
                {cards.map((child, index) => (
                    <div className="mobile-deck__item" key={child.key ?? index}>
                        {child}
                    </div>
                ))}
            </div>
            {!expanded && (
                <div className="mobile-deck__controls">
                    <button
                        type="button"
                        disabled={active === 0}
                        onClick={() => select(active - 1)}
                        aria-label={fr ? 'Carte précédente' : 'Previous card'}
                    >
                        <FiArrowLeft aria-hidden="true" />
                    </button>
                    <span aria-live={paused || reducedMotion ? 'polite' : 'off'} aria-atomic="true">
                        {String(active + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
                        {String(cards.length).padStart(2, '0')}
                    </span>
                    {scrollDriven ? (
                        <FiArrowDown className="mobile-deck__scroll-hint" aria-hidden="true" />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPaused(!paused)}
                            aria-label={
                                paused
                                    ? fr
                                        ? 'Reprendre le défilement'
                                        : 'Resume slideshow'
                                    : fr
                                      ? 'Mettre le défilement en pause'
                                      : 'Pause slideshow'
                            }
                            aria-pressed={paused}
                            disabled={reducedMotion}
                        >
                            {paused || reducedMotion ? (
                                <FiPlay aria-hidden="true" />
                            ) : (
                                <FiPause aria-hidden="true" />
                            )}
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={active === cards.length - 1}
                        onClick={() => select(active + 1)}
                        aria-label={fr ? 'Carte suivante' : 'Next card'}
                    >
                        <FiArrowRight aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    )
    return scrollDriven ? (
        <div
            ref={scene}
            className={`mobile-scroll-deck ${scrollScene.animated ? 'mobile-scroll-deck--animated' : ''}`}
        >
            {content}
        </div>
    ) : (
        content
    )
}
