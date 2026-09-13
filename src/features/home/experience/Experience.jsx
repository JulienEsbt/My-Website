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
    const reducedMotion = useReducedMotion()

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

        const ctx = gsap.context(() => {
            cardsRef.current.filter(Boolean).forEach((card) => {
                gsap.from(card, {
                    y: 35,
                    ease: 'none',
                    scrollTrigger: {trigger: card, start: 'top 95%', end: 'top 65%', scrub: 0.5},
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [reducedMotion])

    return (
        <section
            id="experience"
            className="professional-chapter professional-chapter--experience"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <span className="professional-chapter__number" aria-hidden="true">
                    02
                </span>
                <p className="section-kicker">{t('experience.kicker')}</p>
                <h2>{t('experience.title')}</h2>
                <p className="experience__intro">{t('experience.intro')}</p>
            </div>

            <div className="container experience__container">
                {GROUPS.map((group, index) => (
                    <article
                        key={group.id}
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
                ))}
            </div>
        </section>
    )
}

export default Experience
