import React, {useLayoutEffect, useRef} from 'react'
import {FaTwitter, FaInstagram} from 'react-icons/fa'
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import './footer.css'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {LINKS} from '../../../config/links'

const Footer = () => {
    const {t} = useTranslation()
    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const textRef = useRef(null)

    // Fallback: perso si défini, sinon crypto
    const INSTAGRAM_URL = LINKS.social.instagramPersonal ?? LINKS.social.instagram

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

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
                <li><a href="#experience" ref={(el) => (cardsRef.current[2] = el)}>{t('footer.links.experience')}</a>
                </li>
                <li><a href="#services" ref={(el) => (cardsRef.current[3] = el)}>{t('footer.links.services')}</a></li>
                <li><a href="#portfolio" ref={(el) => (cardsRef.current[4] = el)}>{t('footer.links.portfolio')}</a></li>
                <li><a href="#goals" ref={(el) => (cardsRef.current[5] = el)}>{t('footer.links.goals')}</a></li>
                <li><a href="#contact" ref={(el) => (cardsRef.current[6] = el)}>{t('footer.links.contact')}</a></li>
            </ul>

            <div className="footer__socials" ref={imgRef}>
                <a
                    aria-label="Instagram"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => (cardsRef.current[7] = el)}
                >
                    <FaInstagram/>
                </a>
                <a
                    aria-label="Twitter"
                    href={LINKS.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => (cardsRef.current[8] = el)}
                >
                    <FaTwitter/>
                </a>
                <a
                    aria-label="LinkedIn"
                    href={LINKS.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => (cardsRef.current[9] = el)}
                >
                    <BsLinkedin/>
                </a>
                <a
                    aria-label="GitHub"
                    href={LINKS.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el) => (cardsRef.current[10] = el)}
                >
                    <BsGithub/>
                </a>
            </div>

            <div className="footer__copyright" ref={textRef}>
                <small>{t('footer.copyright')}</small>
            </div>
        </footer>
    )
}

export default Footer