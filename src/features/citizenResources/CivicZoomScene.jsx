import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiArrowDown} from 'react-icons/fi'
import useMobileScrollScenes from './useMobileScrollScenes.js'

export default function CivicZoomScene({children}) {
    const {t} = useTranslation('resources')
    const rootRef = useRef(null)
    const contentRef = useRef(null)
    const pendingTarget = useRef(null)
    const [eligible, setEligible] = useState(false)
    const [continuous, setContinuous] = useState(false)
    const animated = eligible && !continuous
    const mobileEligible = useMobileScrollScenes(rootRef, continuous)
    const motionEnabled = (eligible || mobileEligible) && !continuous

    useEffect(() => {
        const root = rootRef.current
        const content = contentRef.current
        const media = matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)')
        const measure = () => {
            // Only pin a complete section if every line fits at its final scale.
            const height = content.offsetHeight + 60
            root.style.setProperty('--zoom-stage-height', `${height}px`)
            root.style.setProperty('--zoom-distance', `${innerHeight * 0.85}px`)
            const next = media.matches && height < innerHeight - 124
            if (!next && root.classList.contains('civic-zoom--animated')) {
                const bounds = root.getBoundingClientRect()
                if (bounds.top < 100 && bounds.bottom > 100) pendingTarget.current = content
            }
            setEligible(next)
        }
        const observer = new ResizeObserver(measure)
        observer.observe(content)
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
        if (!animated) {
            root.style.removeProperty('--zoom-progress')
            if (pendingTarget.current) {
                pendingTarget.current.scrollIntoView({block: 'start', behavior: 'instant'})
                pendingTarget.current = null
            }
            return
        }
        let frame = 0
        const update = () => {
            frame = 0
            const progress = Math.max(
                0,
                Math.min(1, (100 - root.getBoundingClientRect().top) / (innerHeight * 0.85))
            )
            const eased = progress * progress * (3 - 2 * progress)
            root.style.setProperty('--zoom-progress', String(eased))
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
            root.style.removeProperty('--zoom-progress')
        }
    }, [animated, continuous])

    return (
        <div ref={rootRef} className={`civic-zoom ${animated ? 'civic-zoom--animated' : ''}`}>
            <div className="civic-zoom__stage">
                {(eligible || mobileEligible) && (
                    <div className="civic-scene__toolbar civic-zoom__toolbar">
                        {motionEnabled && (
                            <span>
                                <FiArrowDown aria-hidden="true" />
                                {t('featured.scene.hint')}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (motionEnabled) pendingTarget.current = contentRef.current
                                else
                                    rootRef.current.scrollIntoView({
                                        block: 'start',
                                        behavior: 'instant',
                                    })
                                setContinuous(!continuous)
                            }}
                        >
                            {t(`featured.scene.${motionEnabled ? 'continuous' : 'animated'}`)}
                        </button>
                    </div>
                )}
                <div
                    ref={contentRef}
                    className="civic-zoom__content"
                    onClickCapture={(event) => {
                        if (motionEnabled && event.target.closest('summary')) {
                            pendingTarget.current = event.target.closest('summary')
                            setContinuous(true)
                        }
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export function CivicMobilePanel({children}) {
    return (
        <div className="civic-mobile-panel" data-mobile-scene>
            <div className="civic-mobile-panel__content">{children}</div>
        </div>
    )
}
