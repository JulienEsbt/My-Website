import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {FaCode} from 'react-icons/fa'
import {FiCpu, FiGitBranch} from 'react-icons/fi'
import {ASSETS} from '../../../config/assets'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './about.css'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
    const {t} = useTranslation('home')

    const sectionRef = useRef(null)
    const visualRef = useRef(null)
    const contentRef = useRef(null)

    const cards = [
        {icon: <FaCode/>, title: t('about.cards.expertiseTitle'), text: t('about.cards.expertiseText')},
        {icon: <FiCpu/>, title: t('about.cards.collabTitle'), text: t('about.cards.collabText')},
        {icon: <FiGitBranch/>, title: t('about.cards.innovationTitle'), text: t('about.cards.innovationText')},
    ]

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            gsap.from(visualRef.current, {
                opacity: 0,
                x: -28,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 74%'},
            })

            gsap.from(contentRef.current.children, {
                opacity: 0,
                y: 18,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.08,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 72%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="about" ref={sectionRef}>
            <h5>{t('about.headingSmall')}</h5>
            <h2>{t('about.heading')}</h2>

            <div className="container about__container">
                <aside className="about__visual" ref={visualRef}>
                    <div className="about__photo-card">
                        <div className="about__photo">
                            <img src={ASSETS.main.about.photo} alt={t('header.portraitAlt')}/>
                        </div>

                        <div className="about__caption">
                            <strong>{t('about.caption.title')}</strong>
                            <span>{t('about.caption.text')}</span>
                        </div>
                    </div>
                </aside>

                <div className="about__content" ref={contentRef}>
                    <div className="about__cards">
                        {cards.map((card) => (
                            <article className="about__card" key={card.title}>
                                <div className="about__icon">{card.icon}</div>
                                <div>
                                    <h3>{card.title}</h3>
                                    <p>{card.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="about__bio">
                        <Trans i18nKey="about.bio" ns="home" components={{b: <b/>}}/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About