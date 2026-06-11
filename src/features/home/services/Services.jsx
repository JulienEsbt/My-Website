import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {FiCode, FiLayers, FiCpu} from 'react-icons/fi'
import {BiCheck} from 'react-icons/bi'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        id: 'backend',
        icon: <FiCpu/>,
        items: ['api', 'automation', 'integration', 'quality'],
    },
    {
        id: 'webdev',
        icon: <FiCode/>,
        items: ['site', 'spa', 'uiMotion', 'forms'],
    },
    {
        id: 'blockchain',
        icon: <FiLayers/>,
        items: ['contracts', 'dapp', 'auditLite', 'payments'],
    },
]

const Services = () => {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useLayoutEffect(() => {
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
    }, [])

    return (
        <section id="services" ref={sectionRef}>
            <h5>{t('services.kicker')}</h5>
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
                            <div className="service__icon">{service.icon}</div>

                            <div>
                                <h3>{t(`services.groups.${service.id}.title`)}</h3>
                                <p>{t(`services.groups.${service.id}.description`)}</p>
                            </div>
                        </div>

                        <ul className="service__list">
                            {service.items.map((item) => (
                                <li key={item}>
                                    <BiCheck className="service__list-icon"/>
                                    <p>{t(`services.items.${service.id}.${item}`)}</p>
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