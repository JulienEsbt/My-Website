import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'

const sections = ['approach', 'selection', 'projects', 'further']

export default function CivicSectionNav() {
    const {t} = useTranslation('resources')
    const [active, setActive] = useState(null)
    const ref = useRef(null)
    useEffect(() => {
        let frame = 0
        const update = () => {
            frame = 0
            const boundary = (ref.current?.getBoundingClientRect().bottom || 100) + 70
            let next = 0
            sections.forEach((id, index) => {
                if (document.getElementById(id)?.getBoundingClientRect().top <= boundary)
                    next = index
            })
            setActive((previous) => (previous === next ? previous : next))
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
        }
    }, [])
    return (
        <nav className="civic-section-nav" aria-label={t('nav.label')} ref={ref}>
            <span
                className="civic-section-nav__indicator"
                aria-hidden="true"
                style={{
                    transform: `translateX(${(active ?? 0) * 100}%)`,
                    opacity: active === null ? 0 : 1,
                }}
            />
            {sections.map((id, index) => (
                <a
                    key={id}
                    href={`#${id}`}
                    aria-current={active === index ? 'location' : undefined}
                >
                    {t(`nav.short.${id}`)}
                </a>
            ))}
        </nav>
    )
}
