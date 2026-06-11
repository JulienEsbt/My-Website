import React, {useEffect, useState} from 'react'
import './sectionNav.css'

const SectionNav = ({items, ariaLabel = 'Section navigation'}) => {
    const [active, setActive] = useState(`#${items[0]?.id ?? 'top'}`)

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
            behavior: 'smooth',
        })

        setActive(`#${id}`)
    }

    return (
        <nav className="section-nav" role="navigation" aria-label={ariaLabel}>
            {items.map((item) => {
                const hash = `#${item.id}`

                return (
                    <a
                        key={item.id}
                        href={hash}
                        className={active === hash ? 'active' : ''}
                        aria-label={item.label}
                        data-label={item.label}
                        onClick={handleClick(item.id)}
                    >
                        {item.icon}
                    </a>
                )
            })}
        </nav>
    )
}

export default SectionNav