import React, {useLayoutEffect, useRef} from 'react'
import {BsGithub} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {HOME_ASSETS} from '../../../config/homeAssets.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {LINKS} from '../../../config/links.js'
import {ROUTE_PATHS} from '../../../config/routes.js'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
    {
        id: '1',
        image: HOME_ASSETS.portfolio.brunoPizza,
        link: LINKS.projects.brunoPizza,
        caseStudy: ROUTE_PATHS.brunoPizzaCaseStudy,
        tags: ['react', 'typescript', 'electron', 'express', 'sqlite'],
    },
    {
        id: '2',
        image: HOME_ASSETS.portfolio.myWebsite,
        link: LINKS.projects.myWebsite,
        demo: LINKS.demos.myWebsite,
        caseStudy: ROUTE_PATHS.myWebsiteCaseStudy,
        tags: ['react', 'vite', 'i18n', 'accessibility', 'vercel'],
    },
    {
        id: '3',
        image: HOME_ASSETS.portfolio.megalis,
        link: LINKS.projects.megalis,
        tags: ['solidity', 'evm', 'storage'],
    },
]

export default function Portfolio() {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const cardsRef = useRef([])
    const reducedMotion = useReducedMotion()

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            gsap.from(cardsRef.current.filter(Boolean), {
                opacity: 0,
                y: 24,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.1,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 72%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [reducedMotion])

    return (
        <section id="portfolio" ref={sectionRef}>
            <p className="section-kicker">{t('portfolio.kicker')}</p>
            <h2>{t('portfolio.title')}</h2>
            <p className="portfolio__intro">{t('portfolio.intro')}</p>

            <div className="container portfolio__container">
                {ITEMS.map(({id, image, link, demo, caseStudy, tags}, index) => (
                    <article
                        key={id}
                        className="portfolio__item"
                        ref={(el) => (cardsRef.current[index] = el)}
                    >
                        <a
                            href={demo ?? link}
                            target="_blank"
                            rel="noreferrer"
                            className="portfolio__image"
                            aria-label={`${t(demo ? 'portfolio.demo' : 'portfolio.cta')} · ${t(`portfolio.items.${id}.title`)}`}
                        >
                            <ResponsiveImage
                                media={image}
                                alt={t(`portfolio.items.${id}.title`)}
                                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 360px"
                                loading="lazy"
                                decoding="async"
                            />

                            <span className="portfolio__open">
                                <FiArrowUpRight />
                            </span>
                        </a>

                        <div className="portfolio__body">
                            <span className="portfolio__type">
                                {t(`portfolio.items.${id}.type`)}
                            </span>

                            <h3>{t(`portfolio.items.${id}.title`)}</h3>

                            <p>{t(`portfolio.items.${id}.description`)}</p>

                            <div className="portfolio__tags">
                                {tags.map((tag) => (
                                    <span key={tag}>{t(`portfolio.tags.${tag}`)}</span>
                                ))}
                            </div>

                            <div className="portfolio__actions">
                                {caseStudy && (
                                    <Link className="portfolio__case-study" to={caseStudy}>
                                        <FiArrowUpRight aria-hidden="true" />
                                        {t('portfolio.caseStudy')}
                                    </Link>
                                )}

                                {demo && (
                                    <a
                                        className="portfolio__demo"
                                        href={demo}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FiArrowUpRight aria-hidden="true" />
                                        {t('portfolio.demo')}
                                    </a>
                                )}

                                <a
                                    className="portfolio__link"
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <BsGithub aria-hidden="true" />
                                    {t('portfolio.cta')}
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
