import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import {FaBitcoin, FaCodeBranch, FaEthereum, FaFileCode} from 'react-icons/fa'
import {FiArrowRight, FiCompass, FiShield} from 'react-icons/fi'
import {WEB3_ASSETS} from '../../../config/web3Assets.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import './About.css'

const About = () => {
    const {t} = useTranslation('web3')
    const aboutNft = WEB3_ASSETS.nfts.soulware723

    const cards = [
        {
            id: 'passion',
            icons: [<FaBitcoin key="btc" />, <FaEthereum key="eth" />],
            title: t('about.cards.passionTitle'),
            text: t('about.cards.passionText'),
        },
        {
            id: 'experiment',
            icons: [<FiCompass key="compass" />, <FiShield key="shield" />],
            title: t('about.cards.experimentTitle'),
            text: t('about.cards.experimentText'),
        },
        {
            id: 'dev',
            icons: [<FaCodeBranch key="branch" />, <FaFileCode key="code" />],
            title: t('about.cards.devTitle'),
            text: t('about.cards.devText'),
        },
    ]

    return (
        <section id="about">
            <p className="section-kicker">{t('about.headingSmall')}</p>
            <h2>{t('about.heading')}</h2>

            <div className="container crypto-about">
                <motion.div
                    className="crypto-about__visual"
                    initial={{opacity: 0, x: -35}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, ease: 'easeOut'}}
                >
                    <div className="crypto-about__orb">
                        <a
                            href={aboutNft.openseaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('accessibility.openOnOpenSea', {name: aboutNft.name})}
                        >
                            <ResponsiveImage
                                media={aboutNft.image}
                                alt={aboutNft.name}
                                sizes="(max-width: 700px) 70vw, 420px"
                            />
                        </a>
                    </div>

                    <div className="crypto-about__floating-card crypto-about__floating-card--top">
                        <span>{t('about.visual.domainLabel')}</span>
                        <strong>{t('about.visual.domainValue')}</strong>
                    </div>

                    <div className="crypto-about__floating-card crypto-about__floating-card--bottom">
                        <span>{t('about.visual.focusLabel')}</span>
                        <strong>{t('about.visual.focusValue')}</strong>
                    </div>
                </motion.div>

                <motion.div
                    className="crypto-about__content"
                    initial={{opacity: 0, x: 35}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.6, ease: 'easeOut', delay: 0.08}}
                >
                    <div className="crypto-about__intro">
                        <span>{t('about.badge')}</span>
                        <h3>{t('about.title')}</h3>
                        <p>
                            <Trans i18nKey="about.bio" ns="web3" components={{b: <b />}} />
                        </p>
                    </div>

                    <div className="crypto-about__cards">
                        {cards.map((card, index) => (
                            <motion.article
                                key={card.id}
                                className="crypto-about__card"
                                initial={{opacity: 0, y: 22}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.4, delay: index * 0.08}}
                            >
                                <div className="crypto-about__card-icons">{card.icons}</div>

                                <h4>{card.title}</h4>
                                <p>{card.text}</p>
                            </motion.article>
                        ))}
                    </div>

                    <a href="#knowledge" className="crypto-about__link">
                        {t('about.explore')}
                        <FiArrowRight />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default About
