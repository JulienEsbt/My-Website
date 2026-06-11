import React, {useLayoutEffect, useRef} from 'react'
import {FaInstagram, FaTwitter} from 'react-icons/fa'
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {LINKS} from '../../../config/links'
import {SITE_PAGES} from '../../../config/pages'
import './footer.css'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const {t} = useTranslation('common')
    const footerRef = useRef(null)
    const elementsRef = useRef([])

    const instagramUrl = LINKS.social.instagramPersonal ?? LINKS.social.instagram

    const socials = [
        {label: 'Instagram', href: instagramUrl, icon: <FaInstagram/>},
        {label: 'Twitter / X', href: LINKS.social.twitter, icon: <FaTwitter/>},
        {label: 'LinkedIn', href: LINKS.social.linkedin, icon: <BsLinkedin/>},
        {label: 'GitHub', href: LINKS.social.github, icon: <BsGithub/>},
    ]

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(footerRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {trigger: footerRef.current, start: 'top 85%'},
            })

            gsap.from(elementsRef.current.filter(Boolean), {
                opacity: 0,
                y: 18,
                duration: 0.45,
                stagger: 0.06,
                ease: 'power2.out',
                scrollTrigger: {trigger: footerRef.current, start: 'top 78%'},
            })
        }, footerRef)

        return () => ctx.revert()
    }, [])

    return (
        <footer className="footer-section" ref={footerRef}>
            <div className="container footer-section__container">
                <div className="footer-section__brand" ref={(el) => (elementsRef.current[0] = el)}>
                    <a href="/" className="footer-section__logo">
                        {t('footer.logo')}
                    </a>

                    <p>{t('footer.description')}</p>
                </div>

                <nav className="footer-section__nav" aria-label={t('footer.aria')}>
                    <span ref={(el) => (elementsRef.current[1] = el)}>
                        {t('footer.pages')}
                    </span>

                    <div className="footer-section__links">
                        {SITE_PAGES.map((page, index) => (
                            <a
                                key={page.path}
                                href={page.path}
                                ref={(el) => (elementsRef.current[index + 2] = el)}
                            >
                                {t(page.i18nKey)}
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="footer-section__right" ref={(el) => (elementsRef.current[10] = el)}>
                    <span>{t('footer.socials')}</span>

                    <div className="footer-section__socials">
                        {socials.map(({label, href, icon}) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    <a href="#contact" className="footer-section__cta">
                        {t('footer.cta')}
                        <FiArrowUpRight/>
                    </a>
                </div>
            </div>

            <div className="container footer-section__bottom">
                <small>{t('footer.copyright')}</small>
            </div>
        </footer>
    )
}

export default Footer