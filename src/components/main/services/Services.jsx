import React, {useLayoutEffect, useRef} from 'react'
import {BiCheck} from 'react-icons/bi'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './services.css'
import {useTranslation, Trans} from 'react-i18next'

gsap.registerPlugin(ScrollTrigger)

const Services = () => {
    const {t} = useTranslation(['common'])
    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const textRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Apparition globale
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            })

            // Image
            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px',
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            )

            // Flottement permanent
            gsap.to(imgRef.current, {
                '--ty': '-=6px',
                yoyo: true,
                repeat: -1,
                duration: 3,
                ease: 'sine.inOut',
            })

            // Cartes
            gsap.fromTo(
                cardsRef.current,
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px',
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            )

            // Paragraphe
            gsap.from(textRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id='services' ref={sectionRef}>
            <h5>{t('services.kicker')}</h5>
            <h2>{t('services.title')}</h2>

            <div className='.container services__container'>
                {/* BackEnd */}
                <article className='service'>
                    <div className='service__head' ref={imgRef}>
                        <h3>{t('services.groups.backend')}</h3>
                    </div>
                    <ul className='service__list' ref={(el) => (cardsRef.current[0] = el)}>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.backend.api')}</p></li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.backend.automation')}</p>
                        </li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.backend.integration')}</p>
                        </li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.backend.quality')}</p></li>
                    </ul>
                </article>

                {/* Web Development */}
                <article className='service'>
                    <div className='service__head' ref={imgRef}>
                        <h3>{t('services.groups.webdev')}</h3>
                    </div>
                    <ul className='service__list' ref={(el) => (cardsRef.current[1] = el)}>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.webdev.site')}</p></li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.webdev.spa')}</p></li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.webdev.uiMotion')}</p></li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.webdev.forms')}</p></li>
                    </ul>
                </article>

                {/* Blockchain / Web3 */}
                <article className='service'>
                    <div className='service__head' ref={imgRef}>
                        <h3>{t('services.groups.blockchain')}</h3>
                    </div>
                    <ul className='service__list' ref={(el) => (cardsRef.current[2] = el)}>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.blockchain.contracts')}</p>
                        </li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.blockchain.dapp')}</p></li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.blockchain.auditLite')}</p>
                        </li>
                        <li><BiCheck className='service__list-icon'/><p>{t('services.items.blockchain.payments')}</p>
                        </li>
                    </ul>
                </article>
            </div>
        </section>
    );
};

export default Services;