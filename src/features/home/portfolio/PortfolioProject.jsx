import {BsGithub} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'

export default function PortfolioProject({project, onOpen}) {
    const {t} = useTranslation('home')
    const {id, image, repository, demo, caseStudy, tags} = project
    const visual = (
        <ResponsiveImage
            media={image}
            alt={t(`portfolio.items.${id}.imageAlt`, {
                defaultValue: t(`portfolio.items.${id}.title`),
            })}
            sizes="(max-width: 700px) 92vw, (min-width: 1600px) 850px, 60vw"
            loading="lazy"
            decoding="async"
        />
    )

    return (
        <article className="portfolio__item" data-project={id}>
            {caseStudy ? (
                <Link
                    to={caseStudy}
                    onClick={onOpen}
                    className="portfolio__image"
                    aria-label={`${t('portfolio.caseStudy')} · ${t(`portfolio.items.${id}.title`)}`}
                >
                    {visual}
                    <span className="portfolio__open" aria-hidden="true">
                        <FiArrowUpRight />
                    </span>
                </Link>
            ) : (
                <div className="portfolio__image">{visual}</div>
            )}
            <div className="portfolio__body">
                <span className="portfolio__type">{t(`portfolio.items.${id}.type`)}</span>
                <h3>{t(`portfolio.items.${id}.title`)}</h3>
                <p>{t(`portfolio.items.${id}.description`)}</p>
                <div className="portfolio__tags">
                    {tags.map((tag) => (
                        <span key={tag}>{t(`portfolio.tags.${tag}`)}</span>
                    ))}
                </div>
                <div className="portfolio__actions">
                    {caseStudy && (
                        <Link className="portfolio__case-study" to={caseStudy} onClick={onOpen}>
                            <FiArrowUpRight aria-hidden="true" />
                            {t('portfolio.caseStudy')}
                        </Link>
                    )}
                    {demo && (
                        <a className="portfolio__demo" href={demo} target="_blank" rel="noreferrer">
                            <FiArrowUpRight aria-hidden="true" />
                            {t('portfolio.demo')}
                        </a>
                    )}
                    <a
                        className="portfolio__link"
                        href={repository}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <BsGithub aria-hidden="true" />
                        {t('portfolio.cta')}
                    </a>
                </div>
            </div>
        </article>
    )
}
