import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import gsap from 'gsap'
import SocialsCTA from './SocialsCTA.jsx'
import HeaderSocials from "../../../common/headerSocials/HeaderSocials.jsx";
import {ASSETS} from '../../../../config/assets.js'
import './header.css'

const Header = () => {
    const {t} = useTranslation('web3')

    const root = useRef(null)
    const title = useRef(null)
    const name = useRef(null)
    const role = useRef(null)
    const cta = useRef(null)
    const photo = useRef(null)
    const socials = useRef(null)
    const scroll = useRef(null)

    useLayoutEffect(() => {
        const mm = gsap.matchMedia()
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const tl = gsap.timeline({defaults: {ease: 'power3.out', duration: 0.7}})
            tl
                .from(title.current, {y: 20, opacity: 0})
                .from(name.current, {y: 20, opacity: 0}, '-=0.4')
                .from(role.current, {y: 20, opacity: 0}, '-=0.45')
                .from(cta.current, {y: 20, opacity: 0}, '-=0.45')
                .from(photo.current, {scale: 0.9, opacity: 0}, '-=0.45')
                .from(socials.current, {x: -12, opacity: 0}, '-=0.5')
                .from(scroll.current, {x: 12, opacity: 0}, '-=0.6')
        })
        return () => mm.revert()
    }, [])

    return (
        <header className="hero" ref={root}>
            <div className="container header__container">
                <div className="hero__copy">
                    <h5 ref={title} className="eyebrow">{t('header.eyebrow')}</h5>

                    <h1 ref={name} className="hero__title">
                        <span className="stroke">Julien</span>esbt.eth
                    </h1>

                    <p ref={role} className="hero__subtitle">{t('header.subtitle')}</p>

                    <div ref={cta}>
                        <SocialsCTA/>
                    </div>
                </div>

                <div className="hero__visual">
                    <motion.div
                        ref={photo}
                        initial={false}
                        whileHover={{y: -4}}
                        transition={{type: 'spring', stiffness: 200, damping: 15}}
                        className="me"
                        aria-hidden
                    >
                        <img src={ASSETS.crypto.header.nft1} alt="NFT"/>
                        <div className="glow" aria-hidden/>
                    </motion.div>
                </div>

                <div ref={socials} className="web3-header__socials-wrapper">
                    <HeaderSocials/>
                </div>

                <a
                    ref={scroll}
                    href="#contact"
                    className="scroll__down"
                    aria-label={t('header.scrollAria')}
                >
                    <span className="scroll__dot"/>
                    <span>{t('header.scroll')}</span>
                </a>
            </div>
        </header>
    )
}

export default Header