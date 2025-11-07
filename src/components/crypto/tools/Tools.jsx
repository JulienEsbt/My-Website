import React, {useLayoutEffect, useRef} from 'react'
import './tools.css'
import {BiCheck} from 'react-icons/bi'
import {TbAffiliate} from 'react-icons/tb'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useTranslation} from 'react-i18next'
import {LINKS} from '../../../config/links'

gsap.registerPlugin(ScrollTrigger)

const Tools = () => {
    const {t} = useTranslation('crypto')

    const sectionRef = useRef(null)
    const headsRef = useRef([])  // têtes de cartes (flottement)
    const listsRef = useRef([])  // UL (stagger à l’apparition)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Apparition globale
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            // Apparition + flottement des headers
            headsRef.current.forEach((head) => {
                if (!head) return
                gsap.fromTo(
                    head,
                    {'--ty': '40px', opacity: 0},
                    {
                        '--ty': '0px',
                        opacity: 1,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
                    }
                )
                gsap.to(head, {
                    '--ty': '-=6px',
                    yoyo: true,
                    repeat: -1,
                    duration: 3,
                    ease: 'sine.inOut',
                })
            })

            // Stagger des listes
            gsap.from(listsRef.current.filter(Boolean), {
                opacity: 0,
                y: 14,
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.12,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 75%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    // Sourcing depuis la config centralisée
    const EXCHANGES = (LINKS.tools?.exchanges ?? []).map(x => ({
        label: x.name,
        href: x.url,
        aff: !!x.isReferral,
    }))

    const OTHERS = (LINKS.tools?.others ?? []).map(x => ({
        label: x.name,
        href: x.url,
        aff: !!x.isReferral,
    }))

    const EXPLORERS = (LINKS.tools?.explorers ?? []).map(x => ({
        label: x.name,
        href: x.url,
    }))

    return (
        <section id="tools" ref={sectionRef}>
            <h5>{t('tools.kicker')}</h5>
            <h2>{t('tools.title')}</h2>

            <div className="container services__container">
                {/* Exchanges */}
                <article className="service">
                    <div className="service__head" ref={(el) => (headsRef.current[0] = el)}>
                        <h3>{t('tools.groups.exchanges')}</h3>
                    </div>
                    <ul
                        className="service__list"
                        ref={(el) => (listsRef.current[0] = el)}
                        aria-label={t('tools.aria.listExchanges')}
                    >
                        {EXCHANGES.map((x) => (
                            <li key={x.label}>
                                {x.aff ? (
                                    <TbAffiliate className="service__list-icon"/>
                                ) : (
                                    <BiCheck className="service__list-icon"/>
                                )}
                                <a
                                    href={x.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={t('tools.aria.open', {site: x.label})}
                                >
                                    {x.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>

                {/* Others */}
                <article className="service">
                    <div className="service__head" ref={(el) => (headsRef.current[1] = el)}>
                        <h3>{t('tools.groups.others')}</h3>
                    </div>
                    <ul
                        className="service__list"
                        ref={(el) => (listsRef.current[1] = el)}
                        aria-label={t('tools.aria.listOthers')}
                    >
                        {OTHERS.map((x) => (
                            <li key={x.label}>
                                {x.aff ? (
                                    <TbAffiliate className="service__list-icon"/>
                                ) : (
                                    <BiCheck className="service__list-icon"/>
                                )}
                                <a
                                    href={x.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={t('tools.aria.open', {site: x.label})}
                                >
                                    {x.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>

                {/* Explorers */}
                <article className="service">
                    <div className="service__head" ref={(el) => (headsRef.current[2] = el)}>
                        <h3>{t('tools.groups.explorers')}</h3>
                    </div>
                    <ul
                        className="service__list"
                        ref={(el) => (listsRef.current[2] = el)}
                        aria-label={t('tools.aria.listExplorers')}
                    >
                        {EXPLORERS.map((x) => (
                            <li key={x.label}>
                                <BiCheck className="service__list-icon"/>
                                <a
                                    href={x.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={t('tools.aria.open', {site: x.label})}
                                >
                                    {x.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    )
}

export default Tools