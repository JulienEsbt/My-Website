import {useLayoutEffect} from 'react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

// Measure translated text so the sticky heading stays centered at every desktop size.
export default function useChapterHeading(sectionRef) {
    useLayoutEffect(() => {
        const heading = sectionRef.current?.querySelector('.professional-chapter__heading')
        if (!heading) return undefined
        const cards = [
            ...sectionRef.current.querySelectorAll('.professional-chapter__step > article'),
        ]
        let frame = 0
        let disposed = false
        let previousDimensions = ''
        const refresh = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                if (!disposed) ScrollTrigger.refresh()
            })
        }
        const measure = () => {
            // Read every height before writing styles, which can invalidate layout.
            const headingHeight = heading.firstElementChild.offsetHeight
            const cardHeights = cards.map((card) => card.offsetHeight)
            const dimensions = [headingHeight, ...cardHeights].join(',')
            if (dimensions === previousDimensions) return
            previousDimensions = dimensions
            heading.style.setProperty('--heading-height', `${headingHeight}px`)
            sectionRef.current.style.setProperty(
                '--stage-height',
                `${Math.max(headingHeight, ...cardHeights)}px`
            )
            cards.forEach((card, index) =>
                card.parentElement.style.setProperty('--panel-height', `${cardHeights[index]}px`)
            )
            refresh()
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(heading.firstElementChild)
        cards.forEach((card) => observer.observe(card))
        document.fonts.ready.then(() => {
            if (!disposed) {
                measure()
                refresh()
            }
        })
        return () => {
            disposed = true
            cancelAnimationFrame(frame)
            observer.disconnect()
        }
    }, [sectionRef])
}
