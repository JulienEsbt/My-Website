import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {FiBookOpen, FiBriefcase, FiCheckSquare} from 'react-icons/fi'
import {BiCheck} from 'react-icons/bi'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import './Services.css'
import '../professionalChapters.css'
import useChapterHeading from '../useChapterHeading.js'

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
    useChapterHeading(sectionRef)
    const reducedMotion = useReducedMotion()

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

        const ctx = gsap.context(() => {
            cardsRef.current.filter(Boolean).forEach((card) => {
                gsap.from(card, {
                    y: 55,
                    scale: 0.96,
                    ease: 'none',
                    scrollTrigger: {trigger: card, start: 'top 90%', end: 'top 40%', scrub: 0.5},
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [reducedMotion])

    return (
        <section
            id="services"
            className="professional-chapter professional-chapter--services"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <span className="professional-chapter__number" aria-hidden="true">
                    03
                </span>
                <p className="section-kicker">{t('services.kicker')}</p>
                <h2>{t('services.title')}</h2>
                <p className="services__intro">{t('services.intro')}</p>
            </div>

            <div className="container services__container">
                {SERVICES.map((service, index) => (
                    <div className="professional-chapter__step" key={service.id}>
                        <article className="service" ref={(el) => (cardsRef.current[index] = el)}>
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
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Services
