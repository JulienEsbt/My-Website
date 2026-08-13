import React, {useLayoutEffect, useRef} from 'react'
import {FaInstagram, FaTwitter} from 'react-icons/fa'
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link, NavLink} from 'react-router-dom'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {LINKS} from '../../../../config/links.js'
import {SITE_PAGE_GROUPS} from '../../../../config/pages.js'
import useReducedMotion from '../../accessibility/useReducedMotion.js'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const {t} = useTranslation('common')
    const footerRef = useRef(null)
    const elementsRef = useRef([])
    const reducedMotion = useReducedMotion()

    const instagramUrl = LINKS.social.instagramPersonal

    const socials = [
        {label: 'Instagram', href: instagramUrl, icon: <FaInstagram />},
        {label: 'Twitter / X', href: LINKS.social.twitter, icon: <FaTwitter />},
        {label: 'LinkedIn', href: LINKS.social.linkedin, icon: <BsLinkedin />},
        {label: 'GitHub', href: LINKS.social.github, icon: <BsGithub />},
    ]

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

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
    }, [reducedMotion])

    return (
        <footer className="footer-section" ref={footerRef}>
            <div className="container footer-section__container">
                <div className="footer-section__brand" ref={(el) => (elementsRef.current[0] = el)}>
                    <Link to="/" className="footer-section__logo">
                        {t('footer.logo')}
                    </Link>

                    <p>{t('footer.description')}</p>
                </div>

                <nav className="footer-section__nav" aria-label={t('footer.aria')}>
                    <span ref={(el) => (elementsRef.current[1] = el)}>{t('footer.pages')}</span>

                    <div className="footer-section__nav-groups">
                        {SITE_PAGE_GROUPS.map((group, groupIndex) => (
                            <div className="footer-section__nav-group" key={group.id}>
                                <strong>{t(group.i18nKey)}</strong>
                                <div className="footer-section__links">
                                    {group.pages.map((page, pageIndex) => (
                                        <NavLink
                                            key={page.path}
                                            to={page.path}
                                            end={page.path === '/'}
                                            ref={(el) =>
                                                (elementsRef.current[
                                                    groupIndex * 2 + pageIndex + 2
                                                ] = el)
                                            }
                                        >
                                            {t(page.i18nKey)}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
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

                    <Link to="/#contact" className="footer-section__cta">
                        {t('footer.cta')}
                        <FiArrowUpRight />
                    </Link>
                </div>
            </div>

            <div className="container footer-section__bottom">
                <small>{t('footer.copyright')}</small>
                <Link to="/privacy">{t('footer.privacy')}</Link>
            </div>
        </footer>
    )
}

export default Footer
