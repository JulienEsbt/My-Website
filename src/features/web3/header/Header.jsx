import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import gsap from 'gsap'
import Web3CTA from './Web3CTA.jsx'
import HeaderSocials from '../../../components/common/social/headerSocials/HeaderSocials.jsx'
import {WEB3_ASSETS} from '../../../config/web3Assets.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import './Header.css'

const Header = () => {
    const {t} = useTranslation('web3')
    const featuredNft = WEB3_ASSETS.nfts.soulware2173

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
            tl.from(title.current, {y: 20, opacity: 0})
                .from(name.current, {y: 20, opacity: 0}, '-=0.4')
                .from(role.current, {y: 20, opacity: 0}, '-=0.45')
                .from(cta.current, {y: 20}, '-=0.45')
                .from(photo.current, {scale: 0.9, opacity: 0}, '-=0.45')
                .from(socials.current, {x: -12, opacity: 0}, '-=0.5')
                .from(scroll.current, {x: 12, opacity: 0}, '-=0.6')
        })
        return () => mm.revert()
    }, [])

    return (
        <header id="top" className="hero" ref={root}>
            <div className="container header__container">
                <div className="hero__copy">
                    <p ref={title} className="eyebrow">
                        {t('header.eyebrow')}
                    </p>

                    <h1 ref={name} className="hero__title">
                        <span className="stroke">Julien</span>esbt.eth
                    </h1>

                    <p ref={role} className="hero__subtitle">
                        {t('header.subtitle')}
                    </p>

                    <div ref={cta}>
                        <Web3CTA />
                    </div>
                </div>

                <div className="hero__visual">
                    <motion.div
                        ref={photo}
                        initial={false}
                        whileHover={{y: -4}}
                        transition={{type: 'spring', stiffness: 200, damping: 15}}
                        className="me"
                    >
                        <span className="me__orbit me__orbit--one" aria-hidden="true" />
                        <span className="me__orbit me__orbit--two" aria-hidden="true" />
                        <a
                            href={featuredNft.openseaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('accessibility.openOnOpenSea', {
                                name: featuredNft.name,
                            })}
                        >
                            <ResponsiveImage
                                media={featuredNft.image}
                                alt={featuredNft.name}
                                sizes="(max-width: 700px) 72vw, 430px"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </a>

                        <div className="me__meta">
                            <span>{t('header.visualLabel')}</span>
                            <strong>{t('header.visualValue')}</strong>
                        </div>

                        <div className="me__chain" aria-hidden="true">
                            <span>ETH</span>
                            <span>EVM</span>
                            <span>RPC</span>
                        </div>
                    </motion.div>
                </div>

                <div ref={socials} className="web3-header__socials-wrapper">
                    <HeaderSocials />
                </div>

                <a
                    ref={scroll}
                    href="#contact"
                    className="scroll__down"
                    aria-label={t('header.scrollAria')}
                >
                    <span className="scroll__dot" />
                    <span>{t('header.scroll')}</span>
                </a>
            </div>
        </header>
    )
}

export default Header
