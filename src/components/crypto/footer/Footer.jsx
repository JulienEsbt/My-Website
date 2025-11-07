import React, {useLayoutEffect, useRef} from 'react'
import './footer.css'
import {FaTwitter, FaInstagram, FaTiktok} from 'react-icons/fa'
import {BsYoutube, BsLinkedin, BsGithub} from 'react-icons/bs'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {LINKS} from '../../../config/links'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const {t} = useTranslation('crypto')

    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const textRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Fade-in global
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            // Logo + socials (apparition + léger flottement)
            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px',
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
                }
            )
            gsap.to(imgRef.current, {
                '--ty': '-=6px',
                yoyo: true,
                repeat: -1,
                duration: 3,
                ease: 'sine.inOut',
            })

            // Permalinks + socials items
            gsap.fromTo(
                cardsRef.current,
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px',
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 75%'},
                }
            )

            // Copyright
            gsap.from(textRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.1,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 70%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <footer ref={sectionRef}>
            <a href="#top" className="footer__logo" ref={imgRef}>
                {t('footer.logo')}
            </a>

            <ul className="permalinks" ref={imgRef}>
                <li><a href="#top" ref={(el) => (cardsRef.current[0] = el)}>{t('footer.links.home')}</a></li>
                <li><a href="#about" ref={(el) => (cardsRef.current[1] = el)}>{t('footer.links.about')}</a></li>
                <li><a href="#knowledge" ref={(el) => (cardsRef.current[2] = el)}>{t('footer.links.knowledge')}</a></li>
                <li><a href="#tools" ref={(el) => (cardsRef.current[3] = el)}>{t('footer.links.tools')}</a></li>
                <li><a href="#donation" ref={(el) => (cardsRef.current[4] = el)}>{t('footer.links.donation')}</a></li>
                <li><a href="#contact" ref={(el) => (cardsRef.current[5] = el)}>{t('footer.links.contact')}</a></li>
            </ul>

            <div className="footer__socials" ref={imgRef}>
                <a aria-label="Twitter" href={LINKS.social.twitter} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[6] = el)}><FaTwitter/></a>
                <a aria-label="YouTube" href={LINKS.social.youtube} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[7] = el)}><BsYoutube/></a>
                <a aria-label="TikTok" href={LINKS.social.tiktok} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[8] = el)}><FaTiktok/></a>
                <a aria-label="Instagram" href={LINKS.social.instagram} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[9] = el)}><FaInstagram/></a>
                <a aria-label="LinkedIn" href={LINKS.social.linkedin} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[10] = el)}><BsLinkedin/></a>
                <a aria-label="GitHub" href={LINKS.social.github} target="_blank" rel="noopener noreferrer"
                   ref={(el) => (cardsRef.current[11] = el)}><BsGithub/></a>
            </div>

            <div className="footer__copyright" ref={textRef}>
                <small>{t('footer.copyright')}</small>
            </div>
        </footer>
    )
}

export default Footer