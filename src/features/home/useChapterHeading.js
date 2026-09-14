import {useLayoutEffect} from 'react'

// Measure translated text so the sticky heading stays centered at every desktop size.
export default function useChapterHeading(sectionRef) {
    useLayoutEffect(() => {
        const heading = sectionRef.current?.querySelector('.professional-chapter__heading')
        if (!heading) return undefined
        const cards = [
            ...sectionRef.current.querySelectorAll('.professional-chapter__step > article'),
        ]
        const measure = () => {
            heading.style.setProperty(
                '--heading-height',
                `${heading.firstElementChild.offsetHeight}px`
            )
            sectionRef.current.style.setProperty(
                '--stage-height',
                `${Math.max(heading.firstElementChild.offsetHeight, ...cards.map((card) => card.offsetHeight))}px`
            )
            cards.forEach((card) =>
                card.parentElement.style.setProperty('--panel-height', `${card.offsetHeight}px`)
            )
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(heading.firstElementChild)
        cards.forEach((card) => observer.observe(card))
        return () => observer.disconnect()
    }, [sectionRef])
}
