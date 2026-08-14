import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {FaCode} from 'react-icons/fa'
import {FiCpu, FiGitBranch} from 'react-icons/fi'
import {HOME_ASSETS} from '../../../config/homeAssets.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
    const {t} = useTranslation('home')

    const sectionRef = useRef(null)
    const visualRef = useRef(null)
    const reducedMotion = useReducedMotion()

    const cards = [
        {
            icon: <FaCode />,
            title: t('about.cards.expertiseTitle'),
            text: t('about.cards.expertiseText'),
        },
        {icon: <FiCpu />, title: t('about.cards.collabTitle'), text: t('about.cards.collabText')},
        {
            icon: <FiGitBranch />,
            title: t('about.cards.innovationTitle'),
            text: t('about.cards.innovationText'),
        },
    ]

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

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
        }, sectionRef)

        return () => ctx.revert()
    }, [reducedMotion])

    return (
        <section id="about" ref={sectionRef}>
            <p className="section-kicker">{t('about.headingSmall')}</p>
            <h2>{t('about.heading')}</h2>

            <div className="container about__container">
                <aside className="about__visual" ref={visualRef}>
                    <div className="about__photo-card">
                        <div className="about__photo">
                            <ResponsiveImage
                                media={HOME_ASSETS.about.photo}
                                alt={t('about.photoAlt')}
                                sizes="(max-width: 700px) 88vw, 520px"
                            />
                        </div>

                        <div className="about__caption">
                            <strong>{t('about.caption.title')}</strong>
                            <span>{t('about.caption.text')}</span>
                        </div>
                    </div>
                </aside>

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
                    <Trans i18nKey="about.bio" ns="home" components={{b: <b />}} />
                </div>
            </div>
        </section>
    )
}

export default About
