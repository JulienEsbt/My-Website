import React, {useLayoutEffect, useRef} from 'react'
import {BsGithub} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {PORTFOLIO_PROJECTS} from '../../../config/portfolioProjects.js'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import AgoraProjectCard from './AgoraProjectCard.jsx'
import './Portfolio.css'
import '../professionalChapters.css'

gsap.registerPlugin(ScrollTrigger)

function ProjectImage({caseStudy, title, label, children}) {
    return caseStudy ? (
        <Link to={caseStudy} className="portfolio__image" aria-label={`${label} · ${title}`}>
            {children}
            <span className="portfolio__open" aria-hidden="true">
                <FiArrowUpRight />
            </span>
        </Link>
    ) : (
        <div className="portfolio__image">{children}</div>
    )
}

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
        <section
            id="portfolio"
            className="professional-chapter professional-chapter--portfolio"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <span className="professional-chapter__number" aria-hidden="true">
                    01
                </span>
                <p className="section-kicker">{t('portfolio.kicker')}</p>
                <h2>{t('portfolio.title')}</h2>
                <p className="portfolio__intro">{t('portfolio.intro')}</p>
            </div>

            <div className="container portfolio__container">
                {PORTFOLIO_PROJECTS.map(({id, image, repository, demo, caseStudy, tags}, index) => (
                    <article
                        key={id}
                        className="portfolio__item"
                        ref={(el) => (cardsRef.current[index] = el)}
                    >
                        <ProjectImage
                            caseStudy={caseStudy}
                            title={t(`portfolio.items.${id}.title`)}
                            label={t('portfolio.caseStudy')}
                        >
                            <ResponsiveImage
                                media={image}
                                alt={t(`portfolio.items.${id}.title`)}
                                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 360px"
                                loading="lazy"
                                decoding="async"
                            />
                        </ProjectImage>

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
                                    href={repository}
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

                <AgoraProjectCard
                    cardRef={(element) => (cardsRef.current[PORTFOLIO_PROJECTS.length] = element)}
                />
            </div>
        </section>
    )
}
