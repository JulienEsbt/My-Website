import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import {FiArrowLeft} from 'react-icons/fi'
import useFocusTrap from '../../../components/common/accessibility/useFocusTrap.js'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'
import useImmersiveNavigation from '../../../components/common/accessibility/useImmersiveNavigation.js'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import {CRYPTO_KNOWLEDGE} from '../../../data/web3/knowledge.js'
import './Knowledge.css'

const Knowledge = () => {
    const {t} = useTranslation('web3')

    const [activeCategoryId, setActiveCategoryId] = useState(CRYPTO_KNOWLEDGE[0].id)
    const [activeItemId, setActiveItemId] = useState(CRYPTO_KNOWLEDGE[0].items[0].id)
    const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
    const [isClosingPanel, setIsClosingPanel] = useState(false)
    const closeTimerRef = useRef(null)
    const panelRef = useRef(null)
    const backButtonRef = useRef(null)
    const isMobilePanel = useMediaQuery('(max-width: 560px)')
    const isPanelUnavailable = isMobilePanel && !mobilePanelOpen

    useEffect(
        () => () => {
            clearTimeout(closeTimerRef.current)
        },
        []
    )

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
        setMobilePanelOpen(true)
    }

    const closeMobilePanel = () => {
        setIsClosingPanel(true)

        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = setTimeout(() => {
            setMobilePanelOpen(false)
            setIsClosingPanel(false)
        }, 220)
    }

    useFocusTrap({
        active: isMobilePanel && mobilePanelOpen,
        containerRef: panelRef,
        initialFocusRef: backButtonRef,
        onDismiss: closeMobilePanel,
    })

    useBodyScrollLock(isMobilePanel && mobilePanelOpen)
    useImmersiveNavigation(isMobilePanel && mobilePanelOpen)

    return (
        <section id="knowledge">
            <p className="section-kicker">{t('knowledge.kicker')}</p>
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
                            aria-pressed={activeCategoryId === category.id}
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
                        ref={panelRef}
                        className={`knowledge-v3__panel ${mobilePanelOpen ? 'mobile-open' : ''} ${isClosingPanel ? 'closing' : ''}`}
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.35}}
                        role={isMobilePanel && mobilePanelOpen ? 'dialog' : undefined}
                        aria-modal={isMobilePanel && mobilePanelOpen ? 'true' : undefined}
                        aria-hidden={isPanelUnavailable ? 'true' : undefined}
                        inert={isPanelUnavailable ? '' : undefined}
                        aria-labelledby="knowledge-panel-title"
                        tabIndex={isMobilePanel && mobilePanelOpen ? -1 : undefined}
                    >
                        <button
                            ref={backButtonRef}
                            type="button"
                            className="knowledge-v3__back"
                            onClick={closeMobilePanel}
                        >
                            <FiArrowLeft />
                            {t('knowledge.back')}
                        </button>
                        <div className="knowledge-v3__panel-header">
                            <span>{activeCategory.icon}</span>

                            <div>
                                <h3 id="knowledge-panel-title">
                                    {t(`knowledge.categories.${activeCategory.id}.title`)}
                                </h3>
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
                                    onClick={() => {
                                        setActiveItemId(item.id)
                                        setMobilePanelOpen(true)
                                    }}
                                    aria-pressed={activeItem.id === item.id}
                                >
                                    {t(
                                        `knowledge.categories.${activeCategory.id}.items.${item.id}.name`
                                    )}
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
                                <div className="knowledge-v3__detail-icon">{activeItem.icon}</div>

                                <div>
                                    <h4>
                                        {t(
                                            `knowledge.categories.${activeCategory.id}.items.${activeItem.id}.name`
                                        )}
                                    </h4>
                                    <p>
                                        {t(
                                            `knowledge.categories.${activeCategory.id}.items.${activeItem.id}.description`
                                        )}
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
