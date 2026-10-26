import {FiArrowUpRight, FiChevronDown} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'

export default function AgoraProjectCard({onExpand}) {
    const {t} = useTranslation('home')
    const principles = t('portfolio.agora.principles', {returnObjects: true})
    return (
        <article
            className="portfolio__item portfolio__intent"
            aria-labelledby="agora-project-title"
        >
            <div className="portfolio__image portfolio__agora-visual" aria-hidden="true">
                <svg viewBox="0 0 800 360" focusable="false">
                    <path
                        className="portfolio__agora-lines"
                        d="M400 135 L180 250 M400 135 L400 290 M400 135 L620 250 M180 250 L400 290 L620 250"
                    />
                    <circle className="portfolio__agora-core" cx="400" cy="135" r="48" />
                    <path
                        className="portfolio__agora-bubble"
                        d="M376 118 Q376 108 386 108 H414 Q424 108 424 118 V139 Q424 149 414 149 H392 L378 160 V146 Q376 144 376 139 Z"
                    />
                    {[180, 400, 620].map((x, index) => (
                        <g key={x}>
                            <circle
                                className="portfolio__agora-node"
                                cx={x}
                                cy={index === 1 ? 290 : 250}
                                r="9"
                            />
                            <text x={x} y={index === 1 ? 331 : 291} textAnchor="middle">
                                {principles[index]}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
            <div className="portfolio__body">
                <span className="portfolio__type">{t('portfolio.agora.type')}</span>
                <h3 id="agora-project-title">{t('portfolio.agora.title')}</h3>
                <p>{t('portfolio.agora.description')}</p>
                <ul className="portfolio__tags" aria-label={t('portfolio.agora.principlesLabel')}>
                    {principles.map((principle) => (
                        <li key={principle}>
                            <span>{principle}</span>
                        </li>
                    ))}
                </ul>
                <div className="portfolio__actions">
                    <details
                        className="portfolio__intent-details"
                        onToggle={(event) => {
                            if (event.currentTarget.open) onExpand?.()
                        }}
                    >
                        <summary
                            onClick={(event) => {
                                if (!event.currentTarget.parentElement.open) onExpand?.()
                            }}
                        >
                            <FiArrowUpRight aria-hidden="true" />
                            <span>{t('portfolio.agora.toggle')}</span>
                            <FiChevronDown aria-hidden="true" />
                        </summary>
                        <div className="portfolio__intent-content">
                            <div className="portfolio__intent-grid">
                                {['why', 'objective', 'design'].map((item) => (
                                    <section key={item}>
                                        <h4>{t(`portfolio.agora.${item}Title`)}</h4>
                                        <p>{t(`portfolio.agora.${item}`)}</p>
                                    </section>
                                ))}
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
                </div>
            </div>
        </article>
    )
}
