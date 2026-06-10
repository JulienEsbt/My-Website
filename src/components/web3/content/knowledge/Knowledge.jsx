import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import {CRYPTO_KNOWLEDGE} from '../../../../data/web3/knowledge.js'
import './knowledge.css'

const Knowledge = () => {
    const {t} = useTranslation('web3')

    const [activeCategoryId, setActiveCategoryId] = useState(CRYPTO_KNOWLEDGE[0].id)
    const [activeItemId, setActiveItemId] = useState(CRYPTO_KNOWLEDGE[0].items[0].id)

    const activeCategory = useMemo(
        () => CRYPTO_KNOWLEDGE.find((category) => category.id === activeCategoryId),
        [activeCategoryId]
    )

    const activeItem = useMemo(
        () =>
            activeCategory?.items.find((item) => item.id === activeItemId) ??
            activeCategory?.items[0],
        [activeCategory, activeItemId]
    )

    const selectCategory = (category) => {
        setActiveCategoryId(category.id)
        setActiveItemId(category.items[0].id)
    }

    return (
        <section id="knowledge">
            <h5>{t('knowledge.kicker')}</h5>
            <h2>{t('knowledge.title')}</h2>

            <div className="container knowledge-v3">
                <div className="knowledge-v3__menu">
                    {CRYPTO_KNOWLEDGE.map((category, index) => (
                        <motion.button
                            key={category.id}
                            type="button"
                            className={`knowledge-v3__tab ${
                                activeCategoryId === category.id ? 'active' : ''
                            }`}
                            onClick={() => selectCategory(category)}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.35, delay: index * 0.05}}
                        >
                            <span>{category.icon}</span>

                            <div>
                                <strong>{t(`knowledge.categories.${category.id}.title`)}</strong>
                                <small>{t(`knowledge.levels.${category.level}`)}</small>
                            </div>

                            <em>›</em>
                        </motion.button>
                    ))}
                </div>

                {activeCategory && activeItem && (
                    <motion.article
                        key={activeCategory.id}
                        className="knowledge-v3__panel"
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.35}}
                    >
                        <div className="knowledge-v3__panel-header">
                            <span>{activeCategory.icon}</span>

                            <div>
                                <h3>{t(`knowledge.categories.${activeCategory.id}.title`)}</h3>
                                <p>{t(`knowledge.categories.${activeCategory.id}.description`)}</p>
                            </div>
                        </div>

                        <div className="knowledge-v3__items">
                            {activeCategory.items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`knowledge-v3__item ${
                                        activeItem.id === item.id ? 'active' : ''
                                    }`}
                                    onClick={() => setActiveItemId(item.id)}
                                >
                                    {t(`knowledge.categories.${activeCategory.id}.items.${item.id}.name`)}
                                </button>
                            ))}
                        </div>

                        <motion.div
                            key={activeItem.id}
                            className="knowledge-v3__detail"
                            initial={{opacity: 0, y: 16}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="knowledge-v3__detail-main">
                                <div className="knowledge-v3__detail-icon">
                                    {activeItem.icon}
                                </div>

                                <div>
                                    <h4>
                                        {t(`knowledge.categories.${activeCategory.id}.items.${activeItem.id}.name`)}
                                    </h4>
                                    <p>
                                        {t(`knowledge.categories.${activeCategory.id}.items.${activeItem.id}.description`)}
                                    </p>
                                </div>
                            </div>

                            <div className="knowledge-v3__tags">
                                {activeItem.tags.map((tag) => (
                                    <span key={tag}>{t(`knowledge.tags.${tag}`)}</span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.article>
                )}
            </div>
        </section>
    )
}

export default Knowledge