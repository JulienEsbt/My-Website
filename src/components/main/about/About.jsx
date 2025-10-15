import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {FaAward} from 'react-icons/fa'
import {FiUsers} from 'react-icons/fi'
import {VscFolderLibrary} from 'react-icons/vsc'
import ME from '../../../assets/main/Me2.jpg'
import './about.css'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
    const {t} = useTranslation(['about'])
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
        <section id='about' ref={sectionRef}>
            <h5>{t('headingSmall')}</h5>
            <h2>{t('heading')}</h2>

            <div className='container about__container'>
                <div className='about__me'>
                    <div className='about__me-image' ref={imgRef}>
                        <img src={ME} alt='Portrait'/>
                    </div>
                </div>

                <div className='about__content'>
                    <div className='about__cards'>
                        <article
                            className='about__card'
                            ref={(el) => (cardsRef.current[0] = el)}
                        >
                            <FaAward className='about__icon'/>
                            <h5>{t('cards.expertiseTitle')}</h5>
                            <small>{t('cards.expertiseText')}</small>
                        </article>

                        <article
                            className='about__card'
                            ref={(el) => (cardsRef.current[1] = el)}
                        >
                            <FiUsers className='about__icon'/>
                            <h5>{t('cards.collabTitle')}</h5>
                            <small>{t('cards.collabText')}</small>
                        </article>

                        <article
                            className='about__card'
                            ref={(el) => (cardsRef.current[2] = el)}
                        >
                            <VscFolderLibrary className='about__icon'/>
                            <h5>{t('cards.innovationTitle')}</h5>
                            <small>{t('cards.innovationText')}</small>
                        </article>
                    </div>

                    <p ref={textRef}>
                        <Trans i18nKey='bio' ns='about' components={{b: <b/>}}/>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default About