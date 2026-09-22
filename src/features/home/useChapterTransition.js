import {useLayoutEffect} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

// A feathered reveal keeps the short lateral motion without a hard clipping edge.
export default function useChapterTransition() {
    useLayoutEffect(() => {
        const previous = document.getElementById('experience')
        const next = document.getElementById('services')
        if (!previous || !next) return undefined
        const media = gsap.matchMedia()
        media.add(
            '(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)',
            () => {
                const outgoing = previous.querySelectorAll(
                    '.professional-chapter__heading, .professional-chapter__step'
                )
                const incoming = [
                    next.querySelector('.professional-chapter__heading'),
                    next.querySelector('.professional-chapter__step'),
                ]
                const lastStep = next.querySelector('.professional-chapter__step:last-child')
                const originalMargin = lastStep?.style.marginTop || ''
                const stageHeight = (section) =>
                    parseFloat(getComputedStyle(section).getPropertyValue('--stage-height')) || 350
                const stageTop = (section) => Math.max(80, (innerHeight - stageHeight(section)) / 2)
                const pageTop = (section) => section.getBoundingClientRect().top + scrollY
                const smooth = (value) => value * value * value * (value * (value * 6 - 15) + 10)
                const motion = {progress: 0}
                const elements = [...outgoing, ...incoming]
                let geometry = new Map()
                const measureGeometry = () => {
                    geometry = new Map(
                        elements.map((element) => {
                            const surface = element.firstElementChild || element
                            return [
                                element,
                                {
                                    surface,
                                    left:
                                        surface.getBoundingClientRect().left -
                                        Number(gsap.getProperty(element, 'x')),
                                },
                            ]
                        })
                    )
                }
                let lastProgress = -1
                let lastMotion = -1
                const render = (trigger) => {
                    const progress = trigger.progress
                    if (progress === lastProgress && motion.progress === lastMotion) return
                    lastProgress = progress
                    lastMotion = motion.progress
                    const transitioning = progress > 0 || motion.progress > 0.0001
                    const distance = trigger.end - trigger.start
                    const eased = smooth(motion.progress)
                    const feather = Math.min(320, innerWidth * 0.24)
                    const edge = -feather + (innerWidth + feather * 2) * eased
                    const move = (elements, entering) => {
                        elements.forEach((element) => {
                            const x = (entering ? eased - 1 : eased) * 48
                            const {surface, left: baseLeft} = geometry.get(element)
                            const left = baseLeft + x
                            const near = edge - left - feather / 2
                            const far = edge - left + feather / 2
                            const revealMask = entering
                                ? `linear-gradient(90deg, #000 ${near}px, transparent ${far}px)`
                                : `linear-gradient(90deg, transparent ${near}px, #000 ${far}px)`
                            // A CSS mask clips vertical overflow too, even when fully opaque.
                            // Keep the ordinary stacked cards unmasked outside the handoff.
                            const participates =
                                entering ||
                                element.matches('.professional-chapter__heading') ||
                                element === outgoing[outgoing.length - 1]
                            const hidden =
                                (entering && eased === 0) ||
                                (!entering && eased === 1) ||
                                (!entering &&
                                    transitioning &&
                                    element.matches('.professional-chapter__step') &&
                                    element !== outgoing[outgoing.length - 1])
                            const mask = hidden
                                ? 'linear-gradient(transparent, transparent)'
                                : eased > 0 && eased < 1 && participates
                                  ? revealMask
                                  : 'none'
                            gsap.set(element, {
                                y: (entering ? progress - 1 : progress) * distance,
                                x,
                                rotationY: 0,
                                opacity: hidden ? 0 : 1,
                                visibility: hidden ? 'hidden' : 'visible',
                                clipPath: 'none',
                            })
                            // Mask the painted surface, never the fixed-height sticky wrapper.
                            // Its child can extend beyond that wrapper while its y tween settles.
                            gsap.set(surface, {
                                maskImage: mask,
                                webkitMaskImage: mask,
                            })
                        })
                    }
                    move(outgoing, false)
                    move(incoming, true)
                }
                const setSpacing = () => {
                    const start =
                        pageTop(previous) +
                        previous.offsetHeight -
                        stageHeight(previous) -
                        stageTop(previous)
                    const end = pageTop(next) - stageTop(next)
                    if (lastStep) lastStep.style.marginTop = `${Math.max(0, end - start) * 0.5}px`
                }
                setSpacing()
                measureGeometry()
                // Filter wheel/trackpad steps without delaying the vertical anchoring.
                let trigger
                const follow = gsap.quickTo(motion, 'progress', {
                    duration: 0.38,
                    ease: 'power2.out',
                    onUpdate: () => trigger && render(trigger),
                })
                trigger = ScrollTrigger.create({
                    trigger: previous,
                    start: () =>
                        pageTop(previous) +
                        previous.offsetHeight -
                        stageHeight(previous) -
                        stageTop(previous),
                    end: () => pageTop(next) - stageTop(next),
                    onUpdate: (self) => {
                        follow(self.progress)
                        render(self)
                    },
                    onRefresh: (self) => {
                        setSpacing()
                        measureGeometry()
                        lastProgress = -1
                        follow.tween.pause()
                        motion.progress = self.progress
                        render(self)
                    },
                })
                render(trigger)
                return () => {
                    if (lastStep) lastStep.style.marginTop = originalMargin
                    gsap.set(
                        [...outgoing, ...incoming].map(
                            (element) => element.firstElementChild || element
                        ),
                        {clearProps: 'maskImage,webkitMaskImage'}
                    )
                    follow.tween.kill()
                    trigger.kill()
                    gsap.set([...outgoing, ...incoming], {
                        clearProps:
                            'transform,transformOrigin,backfaceVisibility,opacity,visibility,clipPath,maskImage,webkitMaskImage',
                    })
                }
            }
        )
        return () => media.revert()
    }, [])
}
