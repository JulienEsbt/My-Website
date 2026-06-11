import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import gsap from 'gsap'
import HeaderCTA from './HeaderCTA.jsx'
import HeaderSocials from "../../common/headerSocials/HeaderSocials.jsx";
import {ASSETS} from '../../../config/assets'
import './header.css'

const Header = () => {
    const {t} = useTranslation('home')

    const title = useRef(null)
    const name = useRef(null)
    const subtitle = useRef(null)
    const description = useRef(null)
    const badges = useRef(null)
    const cta = useRef(null)
    const visual = useRef(null)
    const floating = useRef(null)
    const socials = useRef(null)
    const scroll = useRef(null)

    useLayoutEffect(() => {
        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const tl = gsap.timeline({defaults: {ease: 'power3.out', duration: 0.7}})

            tl.from(title.current, {y: 18, opacity: 0})
                .from(name.current, {y: 22, opacity: 0}, '-=0.45')
                .from(subtitle.current, {y: 18, opacity: 0}, '-=0.45')
                .from(description.current, {y: 18, opacity: 0}, '-=0.45')
                .from(badges.current?.children, {y: 14, opacity: 0, stagger: 0.08}, '-=0.4')
                .from(cta.current, {y: 18, opacity: 0}, '-=0.4')
                .from(visual.current, {scale: 0.92, opacity: 0}, '-=0.5')
                .from(floating.current?.children, {y: 16, opacity: 0, stagger: 0.08}, '-=0.35')
                .from(socials.current, {x: -14, opacity: 0}, '-=0.45')
                .from(scroll.current, {x: 14, opacity: 0}, '-=0.45')

            gsap.to('.home-hero__floating-pill', {
                y: -8,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.25,
            })
        })

        return () => mm.revert()
    }, [])

    return (
        <header id="top" className="home-hero">
            <div className="container home-hero__container">
                <div className="home-hero__copy">
                    <span ref={title} className="home-hero__eyebrow">
                        {t('header.eyebrow')}
                    </span>

                    <h1 ref={name} className="home-hero__title">
                        {t('header.name.first')} <span>{t('header.name.last')}</span>
                    </h1>

                    <p ref={subtitle} className="home-hero__subtitle">
                        {t('header.subtitle')}
                    </p>

                    <p ref={description} className="home-hero__description">
                        {t('header.description')}
                    </p>

                    <div ref={badges} className="home-hero__badges">
                        <span>{t('header.badges.badge1')}</span>
                        <span>{t('header.badges.badge2')}</span>
                        <span>{t('header.badges.badge3')}</span>
                    </div>

                    <div ref={cta}>
                        <HeaderCTA/>
                    </div>
                </div>

                <div className="home-hero__visual">
                    <motion.div
                        ref={visual}
                        initial={false}
                        whileHover={{y: -5}}
                        transition={{type: 'spring', stiffness: 180, damping: 16}}
                        className="home-hero__portrait-card"
                    >
                        <div className="home-hero__portrait-frame">
                            <img
                                src={ASSETS.main.header.me}
                                alt={t('header.portraitAlt')}
                            />
                        </div>

                        <div className="home-hero__identity-card">
                            <strong>{t('header.identity.role')}</strong>
                            <span>{t('header.identity.focus')}</span>
                        </div>

                        <div ref={floating} className="home-hero__floating">
                            <span className="home-hero__floating-pill pill-build">
                                {t('header.badges.badge4')}
                            </span>
                            <span className="home-hero__floating-pill pill-systems">
                                {t('header.badges.badge5')}
                            </span>
                            <span className="home-hero__floating-pill pill-human">
                                {t('header.badges.badge6')}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div ref={socials} className="home-hero__socials-wrapper">
                    <HeaderSocials/>
                </div>
            </div>
        </header>
    )
}

export default Header