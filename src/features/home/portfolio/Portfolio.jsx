import React, {useLayoutEffect, useRef} from 'react'
import {BsGithub} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {ASSETS} from '../../../config/assets.js'
import {LINKS} from '../../../config/links.js'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
    {
        id: '1',
        image: ASSETS.main.portfolio.megalis,
        link: LINKS.projects.megalis,
        tags: ['solidity', 'evm', 'storage'],
    },
    {
        id: '2',
        image: ASSETS.main.portfolio.ffnn,
        link: LINKS.projects.ffnn,
        tags: ['python', 'numpy', 'ml'],
    },
    {
        id: '3',
        image: ASSETS.main.portfolio.wave,
        link: LINKS.projects.wave,
        tags: ['dapp', 'web3', 'messages'],
    },
]

export default function Portfolio() {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useLayoutEffect(() => {
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
    }, [])

    return (
        <section id="portfolio" ref={sectionRef}>
            <h5>{t('portfolio.kicker')}</h5>
            <h2>{t('portfolio.title')}</h2>
            <p className="portfolio__intro">{t('portfolio.intro')}</p>

            <div className="container portfolio__container">
                {ITEMS.map(({id, image, link, tags}, index) => (
                    <article
                        key={id}
                        className="portfolio__item"
                        ref={(el) => (cardsRef.current[index] = el)}
                    >
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="portfolio__image"
                            aria-label={`${t('portfolio.cta')} · ${t(`portfolio.items.${id}.title`)}`}
                        >
                            <img
                                src={image}
                                alt={t(`portfolio.items.${id}.title`)}
                                loading="lazy"
                                decoding="async"
                            />

                            <span className="portfolio__open">
                                <FiArrowUpRight/>
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

                            <a
                                className="portfolio__link"
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <BsGithub/>
                                {t('portfolio.cta')}
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}