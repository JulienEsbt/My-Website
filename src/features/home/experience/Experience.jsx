import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import {LINKS} from '../../../config/links.js'
import {FiArrowUpRight} from 'react-icons/fi'
import {FaReact, FaServer} from 'react-icons/fa'
import {SiEthereum} from 'react-icons/si'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import './Experience.css'
import '../professionalChapters.css'
import useChapterHeading from '../useChapterHeading.js'
import useMobileChapter from '../useMobileChapter.js'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = [
    {
        id: 'frontend',
        icon: <FaReact />,
        skills: ['react', 'typescript', 'angular', 'motion'],
    },
    {
        id: 'backend',
        icon: <FaServer />,
        skills: ['java', 'sql', 'apis', 'batch'],
    },
    {
        id: 'web3',
        icon: <SiEthereum />,
        skills: ['solidity', 'ethers', 'hardhat', 'onchain'],
    },
]

const Experience = () => {
    const {t, i18n} = useTranslation('home')
    const fr = i18n.resolvedLanguage?.startsWith('fr')
    const proofs = {
        frontend: {
            to: '/projects/my-website#solution',
            label: fr
                ? 'En pratique : interface et navigation du portfolio'
                : 'In practice: portfolio interface and navigation',
        },
        backend: {
            to: '/projects/bruno-pizza#architecture',
            label: fr
                ? 'En pratique : API et stockage de Bruno Pizza'
                : 'In practice: Bruno Pizza API and storage',
        },
        web3: {
            href: LINKS.projects.megalis,
            label: fr
                ? 'Voir le code du prototype académique Web3'
                : 'View the academic Web3 prototype code',
        },
    }
    const sectionRef = useRef(null)
    const cardsRef = useRef([])
    useChapterHeading(sectionRef)
    const mobileChapter = useMobileChapter(sectionRef)
    const reducedMotion = useReducedMotion()

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

        const media = gsap.matchMedia()
        media.add('(min-width: 1100px) and (min-height: 700px)', () => {
            const ctx = gsap.context(() => {
                const title = sectionRef.current.querySelector(
                    '.professional-chapter__heading-content'
                )
                const stageTop = () =>
                    Math.max(
                        80,
                        (window.innerHeight -
                            parseFloat(
                                getComputedStyle(sectionRef.current).getPropertyValue(
                                    '--stage-height'
                                )
                            )) /
                            2
                    )
                gsap.fromTo(
                    title,
                    {y: 3},
                    {
                        y: -3,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top ${stageTop()}px`,
                            invalidateOnRefresh: true,
                            end: 'bottom 30%',
                            scrub: 0.8,
                        },
                    }
                )
                gsap.fromTo(
                    title,
                    {'--chapter-progress': 0.05},
                    {
                        '--chapter-progress': 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top ${stageTop()}px`,
                            invalidateOnRefresh: true,
                            end: 'bottom center',
                            scrub: 0.3,
                        },
                    }
                )
                const cards = cardsRef.current.filter(Boolean)
                cards.forEach((card, index) => {
                    const step = card.parentElement
                    gsap.fromTo(
                        card,
                        {y: 12},
                        {
                            y: 0,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: step,
                                start: () => (index === 0 ? `top ${stageTop()}px` : 'top 70%'),
                                end: () => (index === 0 ? '+=180' : `top ${stageTop()}px`),
                                invalidateOnRefresh: true,
                                scrub: 0.6,
                            },
                        }
                    )
                    if (cards[index + 1]) {
                        gsap.to(card, {
                            scale: 0.94,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: cards[index + 1].parentElement,
                                start: 'top 65%',
                                end: 'top 28%',
                                scrub: 0.6,
                            },
                        })
                    }
                })
            }, sectionRef)
            return () => ctx.revert()
        })
        return () => media.revert()
    }, [reducedMotion])

    return (
        <section
            id="experience"
            className="professional-chapter professional-chapter--experience"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <div className="professional-chapter__heading-content">
                    <span className="professional-chapter__number" aria-hidden="true">
                        02
                    </span>
                    <p className="section-kicker">{t('experience.kicker')}</p>
                    <h2>{t('experience.title')}</h2>
                    <p className="experience__intro">{t('experience.intro')}</p>
                </div>
            </div>

            {mobileChapter.available && (
                <div className="container professional-chapter__mobile-controls">
                    <span>{t('chapterMotion.hint')}</span>
                    <button
                        type="button"
                        onClick={mobileChapter.toggle}
                        aria-pressed={mobileChapter.continuous}
                    >
                        {t(
                            mobileChapter.continuous
                                ? 'chapterMotion.animated'
                                : 'chapterMotion.continuous'
                        )}
                    </button>
                </div>
            )}

            <div className="container experience__container">
                {GROUPS.map((group, index) => (
                    <div className="professional-chapter__step" key={group.id}>
                        <article
                            className="experience__card"
                            ref={(el) => (cardsRef.current[index] = el)}
                        >
                            <div className="experience__card-head">
                                <div className="experience__icon" aria-hidden="true">
                                    {group.icon}
                                </div>

                                <div>
                                    <h3>{t(`experience.groups.${group.id}.title`)}</h3>
                                    <p>{t(`experience.groups.${group.id}.description`)}</p>
                                </div>
                            </div>

                            <div className="experience__skills">
                                {group.skills.map((skill) => (
                                    <span key={skill}>
                                        {t(`experience.groups.${group.id}.skills.${skill}`)}
                                    </span>
                                ))}
                            </div>
                            {proofs[group.id].to ? (
                                <Link className="experience__proof" to={proofs[group.id].to}>
                                    {proofs[group.id].label}
                                    <FiArrowUpRight aria-hidden="true" />
                                </Link>
                            ) : (
                                <a
                                    className="experience__proof"
                                    href={proofs[group.id].href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {proofs[group.id].label}
                                    <FiArrowUpRight aria-hidden="true" />
                                </a>
                            )}
                        </article>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Experience
