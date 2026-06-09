import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import {FaBitcoin, FaCodeBranch, FaEthereum, FaFileCode} from 'react-icons/fa'
import {BiLineChart} from 'react-icons/bi'
import {BsCurrencyExchange} from 'react-icons/bs'
import {FiArrowRight} from 'react-icons/fi'
import {ASSETS} from '../../../../config/assets.js'
import './about.css'

const About = () => {
    const {t} = useTranslation('crypto')

    const cards = [
        {
            id: 'passion',
            icons: [<FaBitcoin key="btc"/>, <FaEthereum key="eth"/>],
            title: t('about.cards.passionTitle'),
            text: t('about.cards.passionText'),
        },
        {
            id: 'investing',
            icons: [<BsCurrencyExchange key="exchange"/>, <BiLineChart key="chart"/>],
            title: t('about.cards.investingTitle'),
            text: t('about.cards.investingText'),
        },
        {
            id: 'dev',
            icons: [<FaCodeBranch key="branch"/>, <FaFileCode key="code"/>],
            title: t('about.cards.devTitle'),
            text: t('about.cards.devText'),
        },
    ]

    return (
        <section id="about">
            <h5>{t('about.headingSmall')}</h5>
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
                        <img
                            src={ASSETS.crypto.about.nft2}
                            alt={t('about.alt')}
                        />
                    </div>

                    <div className="crypto-about__floating-card crypto-about__floating-card--top">
                        <span>Web3</span>
                        <strong>EVM • DeFi • Wallets</strong>
                    </div>

                    <div className="crypto-about__floating-card crypto-about__floating-card--bottom">
                        <span>Focus</span>
                        <strong>Build, learn, explore</strong>
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
                            <Trans i18nKey="about.bio" ns="crypto" components={{b: <b/>}}/>
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
                                <div className="crypto-about__card-icons">
                                    {card.icons}
                                </div>

                                <h4>{card.title}</h4>
                                <p>{card.text}</p>
                            </motion.article>
                        ))}
                    </div>

                    <a href="#knowledge" className="crypto-about__link">
                        {t('about.explore')}
                        <FiArrowRight/>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default About