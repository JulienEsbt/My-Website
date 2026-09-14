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

        const media = gsap.matchMedia()
        media.add('(min-width: 1100px) and (min-height: 700px)', () => {
            const ctx = gsap.context(() => {
                const title = sectionRef.current.querySelector(
                    '.professional-chapter__heading-content'
                )
                const stageTop = () =>
                    Math.max(
                        80,
                        (window.innerHeight -
                            parseFloat(
                                getComputedStyle(sectionRef.current).getPropertyValue(
                                    '--stage-height'
                                )
                            )) /
                            2
                    )
                gsap.fromTo(
                    title,
                    {y: 3},
                    {
                        y: -3,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top ${stageTop()}px`,
                            invalidateOnRefresh: true,
                            end: 'bottom 30%',
                            scrub: 0.8,
                        },
                    }
                )
                gsap.fromTo(
                    title,
                    {'--chapter-progress': 0.05},
                    {
                        '--chapter-progress': 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top ${stageTop()}px`,
                            invalidateOnRefresh: true,
                            end: 'bottom center',
                            scrub: 0.3,
                        },
                    }
                )
                const cards = cardsRef.current.filter(Boolean)
                cards.forEach((card, index) => {
                    const step = card.parentElement
                    gsap.fromTo(
                        card,
                        {y: 12},
                        {
                            y: 0,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: step,
                                start: () => (index === 0 ? `top ${stageTop()}px` : 'top 70%'),
                                end: () => (index === 0 ? '+=180' : `top ${stageTop()}px`),
                                invalidateOnRefresh: true,
                                scrub: 0.6,
                            },
                        }
                    )
                    if (cards[index + 1]) {
                        gsap.to(card, {
                            scale: 0.94,
                            opacity: 0.35,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: cards[index + 1].parentElement,
                                start: 'top 65%',
                                end: 'top 28%',
                                scrub: 0.6,
                            },
                        })
                    }
                })
            }, sectionRef)
            return () => ctx.revert()
        })
        return () => media.revert()
    }, [reducedMotion])

    return (
        <section
            id="services"
            className="professional-chapter professional-chapter--services"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <div className="professional-chapter__heading-content">
                    <span className="professional-chapter__number" aria-hidden="true">
                        03
                    </span>
                    <p className="section-kicker">{t('services.kicker')}</p>
                    <h2>{t('services.title')}</h2>
                    <p className="services__intro">{t('services.intro')}</p>
                </div>
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
