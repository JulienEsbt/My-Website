import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {FiBookOpen, FiBriefcase, FiCheckSquare} from 'react-icons/fi'
import {BiCheck} from 'react-icons/bi'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        id: 'background',
        icon: <FiBookOpen />,
        items: ['education', 'academic', 'perspective'],
    },
    {
        id: 'work',
        icon: <FiBriefcase />,
        items: ['interfaces', 'batch', 'documents', 'integration'],
    },
    {
        id: 'method',
        icon: <FiCheckSquare />,
        items: ['frame', 'iterate', 'verify', 'document'],
    },
]

const Services = () => {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const cardsRef = useRef([])
    const reducedMotion = useReducedMotion()

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            gsap.from(cardsRef.current.filter(Boolean), {
                opacity: 0,
                y: 24,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.1,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 72%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [reducedMotion])

    return (
        <section id="services" ref={sectionRef}>
            <p className="section-kicker">{t('services.kicker')}</p>
            <h2>{t('services.title')}</h2>
            <p className="services__intro">{t('services.intro')}</p>

            <div className="container services__container">
                {SERVICES.map((service, index) => (
                    <article
                        key={service.id}
                        className="service"
                        ref={(el) => (cardsRef.current[index] = el)}
                    >
                        <div className="service__head">
                            <div className="service__icon" aria-hidden="true">
                                {service.icon}
                            </div>

                            <div>
                                <h3>{t(`services.groups.${service.id}.title`)}</h3>
                                <p>{t(`services.groups.${service.id}.description`)}</p>
                            </div>
                        </div>

                        <ul className="service__list">
                            {service.items.map((item) => (
                                <li key={item}>
                                    <BiCheck className="service__list-icon" />
                                    <p>{t(`services.groups.${service.id}.items.${item}`)}</p>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Services
