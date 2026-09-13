import React from 'react'
import {FiChevronDown, FiMessageCircle} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'

const AgoraProjectCard = ({cardRef}) => {
    const {t} = useTranslation('home')

    return (
        <article ref={cardRef} className="portfolio__intent" aria-labelledby="agora-project-title">
            <div className="portfolio__intent-overview">
                <div className="portfolio__intent-mark" aria-hidden="true">
                    <span className="portfolio__intent-icon">
                        <FiMessageCircle />
                    </span>
                    <span className="portfolio__intent-node portfolio__intent-node--one" />
                    <span className="portfolio__intent-node portfolio__intent-node--two" />
                    <span className="portfolio__intent-node portfolio__intent-node--three" />
                </div>

                <div className="portfolio__intent-copy">
                    <span className="portfolio__type">{t('portfolio.agora.type')}</span>
                    <h3 id="agora-project-title">{t('portfolio.agora.title')}</h3>
                    <p>{t('portfolio.agora.description')}</p>

                    <ul
                        className="portfolio__intent-principles"
                        aria-label={t('portfolio.agora.principlesLabel')}
                    >
                        {t('portfolio.agora.principles', {returnObjects: true}).map((principle) => (
                            <li key={principle}>{principle}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <details className="portfolio__intent-details">
                <summary>
                    <span>{t('portfolio.agora.toggle')}</span>
                    <FiChevronDown aria-hidden="true" />
                </summary>

                <div className="portfolio__intent-content">
                    <div className="portfolio__intent-grid">
                        <section>
                            <h4>{t('portfolio.agora.whyTitle')}</h4>
                            <p>{t('portfolio.agora.why')}</p>
                        </section>

                        <section>
                            <h4>{t('portfolio.agora.objectiveTitle')}</h4>
                            <p>{t('portfolio.agora.objective')}</p>
                        </section>

                        <section>
                            <h4>{t('portfolio.agora.designTitle')}</h4>
                            <p>{t('portfolio.agora.design')}</p>
                        </section>
                    </div>

                    <section className="portfolio__intent-status">
                        <h4>{t('portfolio.agora.statusTitle')}</h4>
                        <p>{t('portfolio.agora.status')}</p>
                    </section>

                    <section className="portfolio__intent-open-questions">
                        <h4>{t('portfolio.agora.questionsTitle')}</h4>
                        <p>{t('portfolio.agora.questions')}</p>
                    </section>
                </div>
            </details>
        </article>
    )
}

export default AgoraProjectCard
