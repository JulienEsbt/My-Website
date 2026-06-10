import React, {useLayoutEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {FaReact, FaServer} from 'react-icons/fa'
import {SiEthereum} from 'react-icons/si'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './experience.css'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = [
    {
        id: 'frontend',
        icon: <FaReact/>,
        skills: ['react', 'typescript', 'angular', 'motion'],
    },
    {
        id: 'backend',
        icon: <FaServer/>,
        skills: ['java', 'sql', 'apis', 'batch'],
    },
    {
        id: 'web3',
        icon: <SiEthereum/>,
        skills: ['solidity', 'ethers', 'hardhat', 'onchain'],
    },
]

const Experience = () => {
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
        <section id="experience" ref={sectionRef}>
            <h5>{t('experience.kicker')}</h5>
            <h2>{t('experience.title')}</h2>
            <p className="experience__intro">{t('experience.intro')}</p>

            <div className="container experience__container">
                {GROUPS.map((group, index) => (
                    <article
                        key={group.id}
                        className="experience__card"
                        ref={(el) => (cardsRef.current[index] = el)}
                    >
                        <div className="experience__card-head">
                            <div className="experience__icon">{group.icon}</div>

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
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Experience