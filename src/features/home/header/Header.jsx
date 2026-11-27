import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import gsap from 'gsap'
import HeaderCTA from './HeaderCTA.jsx'
import HeaderSocials from '../../../components/common/social/headerSocials/HeaderSocials.jsx'
import {HOME_ASSETS} from '../../../config/homeAssets.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import './Header.css'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import MobileHomeHeader from './MobileHomeHeader.jsx'

const DesktopHeader = () => {
    const {t} = useTranslation('home')

    const header = useRef(null)

    useLayoutEffect(() => {
        const mm = gsap.matchMedia(header)
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.timeline({defaults: {ease: 'power3.out', duration: 0.7}})
                .from('.home-hero__eyebrow', {y: 18, opacity: 0})
                .from('.home-hero__title', {y: 22, opacity: 0}, '-=0.45')
                .from('.home-hero__subtitle', {y: 18, opacity: 0}, '-=0.45')
                .from('.home-hero__description', {y: 18, opacity: 0}, '-=0.45')
                .from(
                    '.home-hero__badges > span',
                    {y: 14, opacity: 0, stagger: 0.08, clearProps: 'transform,translate'},
                    '-=0.4'
                )
                .from('.cta', {y: 18, opacity: 0}, '-=0.4')
                .from('.home-hero__visual', {scale: 0.92, opacity: 0}, '-=0.5')
                .from(
                    '.home-hero__floating-pill',
                    {'--pill-entry-y': '16px', opacity: 0, stagger: 0.08},
                    '-=0.35'
                )
                .from('.home-hero__socials-wrapper > *', {x: -14}, '-=0.45')

            gsap.to('.home-hero__floating-pill', {
                '--pill-float-y': '-8px',
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
        <header ref={header} id="top" className="home-hero entry-screen">
            <div className="container home-hero__container">
                <div className="home-hero__socials-wrapper">
                    <HeaderSocials />
                </div>
                <div className="home-hero__copy">
                    <span className="home-hero__eyebrow">{t('header.eyebrow')}</span>

                    <h1 className="home-hero__title">
                        {t('header.name.first')} <span>{t('header.name.last')}</span>
                    </h1>

                    <p className="home-hero__subtitle">{t('header.subtitle')}</p>

                    <p className="home-hero__description">{t('header.description')}</p>

                    <div className="home-hero__badges">
                        <span>{t('header.badges.badge1')}</span>
                        <span>{t('header.badges.badge2')}</span>
                        <span>{t('header.badges.badge3')}</span>
                    </div>

                    <HeaderCTA />
                </div>

                <div className="home-hero__visual">
                    <div className="home-hero__portrait-card">
                        <div className="home-hero__portrait-frame">
                            <ResponsiveImage
                                media={HOME_ASSETS.header.me}
                                alt={t('header.portraitAlt')}
                                sizes="(max-width: 700px) 128px, (min-width: 1800px) 26vw, 420px"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>

                        <div className="home-hero__identity-card">
                            <strong>{t('header.identity.role')}</strong>
                            <span>{t('header.identity.focus')}</span>
                        </div>

                        <div className="home-hero__floating">
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
                    </div>
                </div>
            </div>
        </header>
    )
}

export default function Header() {
    const mobile = useMediaQuery('(max-width: 700px)')
    return mobile ? <MobileHomeHeader /> : <DesktopHeader />
}
