import React, {useLayoutEffect, useRef} from 'react'
import {BsGithub} from 'react-icons/bs'
import {useTranslation} from 'react-i18next'
import IMG1 from '../../../assets/main/Megalis.png'
import IMG2 from '../../../assets/main/FFNN.png'
import IMG3 from '../../../assets/main/Wave.png'
import './portfolio.css'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {LINKS} from '../../../config/links'

gsap.registerPlugin(ScrollTrigger)

// on garde l'ordre + l'ID pour l'i18n, mais on lit les URLs depuis LINKS
const ITEMS = [
    {id: '1', image: IMG1, link: LINKS.projects.megalis},
    {id: '2', image: IMG2, link: LINKS.projects.ffnn},
    {id: '3', image: IMG3, link: LINKS.projects.wave}
]

export default function Portfolio() {
    const {t} = useTranslation(['common'])
    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const btnRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px', opacity: 1, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
                }
            )

            gsap.to(imgRef.current, {
                '--ty': '-=6px', yoyo: true, repeat: -1, duration: 3, ease: 'sine.inOut',
            })

            gsap.fromTo(
                cardsRef.current.filter(Boolean),
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px', opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12,
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 75%'},
                }
            )

            gsap.from(btnRef.current, {
                opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 70%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="portfolio" ref={sectionRef}>
            <h5>{t('portfolio.kicker')}</h5>
            <h2>{t('portfolio.title')}</h2>

            <div className="container portfolio__container" ref={imgRef}>
                {ITEMS.map(({id, image, link}, idx) => (
                    <article key={id} className="portfolio__item">
                        <div
                            className="portfolio__item-image"
                            ref={(el) => (cardsRef.current[idx] = el)}
                        >
                            <img
                                src={image}
                                alt={t(`portfolio.items.${id}.title`)}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <h3>{t(`portfolio.items.${id}.title`)}</h3>
                        <div className="portfolio__item-cta">
                            <a
                                className="btn"
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${t('portfolio.cta')} · ${t(`portfolio.items.${id}.title`)}`}
                                ref={idx === 0 ? btnRef : undefined}
                            >
                                <BsGithub/> {t('portfolio.cta')} <BsGithub/>
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}