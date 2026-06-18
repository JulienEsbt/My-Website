import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'
import './DreamDestinations.css'

const DreamDestinations = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    return (
        <section id="dreams" className="dream-section">
            <h5>{t('dreams.kicker')}</h5>
            <h2>{t('dreams.title')}</h2>
            <p className="dream-section__intro">{t('dreams.intro')}</p>

            <div className="container dream-destinations">
                {dreamDestinations.map((destination, index) => {
                    const name = isFr ? destination.name : destination.nameEn
                    const country = isFr ? destination.country : destination.countryEn
                    const category = isFr ? destination.category : destination.categoryEn
                    const priority = isFr ? destination.priorityLabel : destination.priorityLabelEn
                    const reason = isFr ? destination.reason : destination.reasonEn

                    return (
                        <motion.article
                            key={destination.id}
                            className="dream-card"
                            initial={{opacity: 0, y: 35}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.45, delay: index * 0.08}}
                        >
                            <div className="dream-card__top">
                                <span className="dream-card__emoji">{destination.emoji}</span>
                                <span className="dream-card__priority">{priority}</span>
                            </div>

                            <span className="dream-card__category">{category}</span>

                            <h3>{name}</h3>
                            <small>{country}</small>

                            <p>{reason}</p>
                        </motion.article>
                    )
                })}
            </div>
        </section>
    )
}

export default DreamDestinations