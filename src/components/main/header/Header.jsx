import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import gsap from 'gsap'
import CTA from './CTA'
import HeaderSocials from './HeaderSocials'
import ME from '../../../assets/main/Me.png'
import './header.css'

const Header = () => {
    const {t} = useTranslation('common')

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
                        <span className="stroke">Julien</span> Esterbet
                    </h1>

                    <p ref={role} className="hero__subtitle">{t('header.subtitle')}</p>

                    <div ref={cta}>
                        <CTA/>
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
                        <img src={ME} alt="Portrait of Julien Esterbet"/>
                        <div className="glow" aria-hidden/>
                    </motion.div>
                </div>

                <div className="hero__left" ref={socials}>
                    <HeaderSocials/>
                </div>

                <a
                    ref={scroll}
                    href="#about"
                    className="scroll__down"
                    aria-label="Scroll to About section"
                >
                    <span className="scroll__dot"/>
                    <span>Scroll</span>

                </a>
            </div>
        </header>
    )
}
// TODO Bouton Scroll !
export default Header