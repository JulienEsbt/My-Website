import {useLayoutEffect} from 'react'

// Measure translated text so the sticky heading stays centered at every desktop size.
export default function useChapterHeading(sectionRef) {
    useLayoutEffect(() => {
        const heading = sectionRef.current?.querySelector('.professional-chapter__heading')
        if (!heading) return undefined
        const measure = () =>
            heading.style.setProperty('--heading-height', `${heading.offsetHeight}px`)
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(heading)
        return () => observer.disconnect()
    }, [sectionRef])
}
