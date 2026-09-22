import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiArrowUpRight, FiChevronDown, FiExternalLink} from 'react-icons/fi'
import {formatDate} from '../../i18n/formatters.js'

export default function ResourceCard({resource, number, compact = false}) {
    const {t, i18n} = useTranslation('resources')
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'
    const copy = t(`resources.${resource.id}`, {returnObjects: true})
    const name = copy.name || resource.name
    const [previewFailed, setPreviewFailed] = useState(false)
    return (
        <article
            id={`resource-${resource.id}`}
            className={`civic-card civic-card--${resource.id} ${resource.featured ? 'civic-card--featured' : 'civic-card--compact'}`}
            aria-labelledby={`title-${resource.id}`}
        >
            {resource.featured &&
                (resource.preview && !previewFailed ? (
                    <figure className="civic-preview">
                        <div className="civic-preview__bar">
                            <span aria-hidden="true">● ● ●</span>
                            <span>{resource.domain}</span>
                        </div>
                        <a
                            className="civic-preview__link"
                            href={resource.url}
                            aria-label={t('card.visitPreview', {name})}
                        >
                            <img
                                src={resource.preview.src}
                                width="960"
                                height="600"
                                loading="lazy"
                                decoding="async"
                                alt={t('card.preview', {name})}
                                onError={() => setPreviewFailed(true)}
                            />
                            <span className="civic-preview__action" aria-hidden="true">
                                <FiArrowUpRight />
                            </span>
                        </a>
                        <figcaption>{t('uses.' + resource.use)}</figcaption>
                    </figure>
                ) : (
                    <div className="civic-card__identity" aria-hidden="true">
                        <span className="civic-card__monogram">
                            {String(number).padStart(2, '0')}
                        </span>
                        <span className="civic-card__wordmark">{resource.name}</span>
                        <span className="civic-card__identity-line" />
                    </div>
                ))}
            {!resource.featured && (
                <div className="civic-card__question">
                    <span>
                        {String(number).padStart(2, '0')} / {copy.kind}
                    </span>
                    <p>{copy.question}</p>
                    <FiArrowUpRight aria-hidden="true" />
                </div>
            )}
            <div className="civic-card__body">
                <div className="civic-card__meta">
                    <span>
                        {resource.featured && (
                            <b className="civic-card__number" aria-hidden="true">
                                {String(number).padStart(2, '0')}
                            </b>
                        )}
                        {copy.kind}
                    </span>
                    <span>{t('card.language')}</span>
                </div>
                <h3 id={`title-${resource.id}`}>{name}</h3>
                <p className="civic-card__description">
                    {compact ? copy.teaser : copy.description}
                </p>
                <div className="civic-card__context">
                    <p className="civic-card__owner">
                        {t('card.owner')} {copy.owner}
                    </p>
                    <p className="civic-card__limit">
                        <strong>{t('card.limit')}</strong>
                        {copy.limit}
                    </p>
                </div>
                <a className="civic-card__visit" href={resource.url}>
                    <span>
                        {copy.cta}
                        <small>{resource.domain}</small>
                    </span>
                    <FiArrowUpRight aria-hidden="true" />
                </a>
                <details className="civic-card__details">
                    <summary>
                        <span className="civic-card__details-label">{t('card.details')}</span>
                        <span className="civic-card__mobile-label">{t('card.detailsMobile')}</span>
                        <span className="sr-only"> — {name}</span>
                        <FiChevronDown aria-hidden="true" />
                    </summary>
                    <div>
                        <div className="civic-card__mobile-context">
                            <p className="civic-card__owner">
                                {t('card.owner')} {copy.owner}
                            </p>
                            <p className="civic-card__limit">
                                <strong>{t('card.limit')}</strong>
                                {copy.limit}
                            </p>
                        </div>
                        {compact && <p>{copy.description}</p>}
                        <p>{copy.method}</p>
                        <ul>
                            {resource.sources.map((source, index) => (
                                <li key={source.url}>
                                    <a href={source.url}>
                                        {t(`card.sourceLabels.${index}`)} · {source.label}{' '}
                                        <FiExternalLink aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {resource.preview && (
                            <p className="civic-card__date">
                                <a href={resource.preview.url}>
                                    {t('card.previewCredit', {
                                        name: resource.name,
                                        date: formatDate(resource.preview.date, language),
                                    })}
                                    <FiExternalLink aria-hidden="true" />
                                </a>
                            </p>
                        )}
                        <p className="civic-card__date">
                            {t('card.checked')}{' '}
                            <time dateTime={resource.reviewedAt}>
                                {formatDate(resource.reviewedAt, language)}
                            </time>
                            .
                        </p>
                    </div>
                </details>
            </div>
        </article>
    )
}
