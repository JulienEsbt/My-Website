import React, {useLayoutEffect, useRef} from 'react'
import './knowledge.css'
import {BsPatchCheckFill} from 'react-icons/bs'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useTranslation} from 'react-i18next'

gsap.registerPlugin(ScrollTrigger)

const Knowledge = () => {
    const {t} = useTranslation('crypto')

    const sectionRef = useRef(null)
    const detailsRef = useRef([])

    useLayoutEffect(() => {
        const el = sectionRef.current
        const details = detailsRef.current.filter(Boolean)

        const ctx = gsap.context(() => {
            gsap.from(el, {
                opacity: 0,
                y: 24,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {trigger: el, start: 'top 80%'},
            })

            gsap.from(details, {
                opacity: 0,
                y: 12,
                duration: 0.4,
                ease: 'power2.out',
                stagger: 0.06,
                scrollTrigger: {trigger: el, start: 'top 70%'},
            })

            details.forEach((node) => {
                node.addEventListener('mouseenter', () =>
                    gsap.to(node, {scale: 1.02, duration: 0.15, ease: 'power1.out'})
                )
                node.addEventListener('mouseleave', () =>
                    gsap.to(node, {scale: 1, duration: 0.2, ease: 'power1.out'})
                )
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    // Données (front/back ≈ blockchain/other) — titres & descriptions via i18n
    const BLOCKCHAIN = [
        {name: 'Bitcoin', descKey: 'knowledge.items.bitcoin'},
        {name: 'Ethereum', descKey: 'knowledge.items.ethereum'},
        {name: 'Polkadot', descKey: 'knowledge.items.polkadot'},
        {name: 'Solana', descKey: 'knowledge.items.solana'},
        {name: 'Elrond', descKey: 'knowledge.items.elrond'},
        {name: 'Cosmos', descKey: 'knowledge.items.cosmos'},
    ]

    const OTHER = [
        {name: t('knowledge.labels.exchanges'), descKey: 'knowledge.items.exchanges'},
        {name: t('knowledge.labels.wallets'), descKey: 'knowledge.items.wallets'},
        {name: t('knowledge.labels.chains'), descKey: 'knowledge.items.chains'},
        {name: 'NFTs', descKey: 'knowledge.items.nfts'},
        {name: t('knowledge.labels.tech'), descKey: 'knowledge.items.tech'},
        {name: t('knowledge.labels.tools'), descKey: 'knowledge.items.tools'},
    ]

    const setDetailRef = (el, idx) => (detailsRef.current[idx] = el)

    return (
        <section id="knowledge" ref={sectionRef}>
            <h5>{t('knowledge.kicker')}</h5>
            <h2>{t('knowledge.title')}</h2>

            <div className="container knowledge__container">
                {/* Bloc Blockchain */}
                <div className="knowledge__frontend">
                    <h3>{t('knowledge.groups.blockchain')}</h3>
                    <div className="knowledge__content">
                        {BLOCKCHAIN.map((it, i) => (
                            <article
                                className="knowledge__details"
                                key={`bc-${it.name}`}
                                ref={(el) => setDetailRef(el, i)}
                            >
                                <BsPatchCheckFill className="knowledge__details-icon"/>
                                <div>
                                    <h4>{it.name}</h4>
                                    <small className="text-light">{t(it.descKey)}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Bloc Other */}
                <div className="knowledge__backend">
                    <h3>{t('knowledge.groups.other')}</h3>
                    <div className="knowledge__content">
                        {OTHER.map((it, i) => (
                            <article
                                className="knowledge__details"
                                key={`ot-${it.name}-${i}`}
                                ref={(el) => setDetailRef(el, BLOCKCHAIN.length + i)}
                            >
                                <BsPatchCheckFill className="knowledge__details-icon"/>
                                <div>
                                    <h4>{it.name}</h4>
                                    <small className="text-light">{t(it.descKey)}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Knowledge