import {BsGithub} from 'react-icons/bs'
import {FiArrowUpRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {OPENDENTE_PANELS} from '../../../config/opendenteMedia.js'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'

export default function PortfolioProject({project, onOpen}) {
    const {t, i18n} = useTranslation('home')
    const {id, image, repository, demo, caseStudy, tags} = project
    const alt = t(`portfolio.items.${id}.imageAlt`, {
        defaultValue: t(`portfolio.items.${id}.title`),
    })
    const panels = OPENDENTE_PANELS[i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'fr']
    const visual = (
        <div className="portfolio__cover">
            {id !== '3' && (
                <ResponsiveImage
                    media={image}
                    className="portfolio__ambient"
                    alt=""
                    aria-hidden="true"
                    sizes="96px"
                    loading="lazy"
                />
            )}
            {id === '4' ? (
                <div className="portfolio__opendente" role="img" aria-label={alt}>
                    <ResponsiveImage
                        media={panels.dark}
                        alt=""
                        className="portfolio__opendente-screen portfolio__opendente-screen--dark"
                        sizes="(min-width: 1600px) 200px, 25vw"
                    />
                    <ResponsiveImage
                        media={panels.light}
                        alt=""
                        className="portfolio__opendente-screen portfolio__opendente-screen--light"
                        sizes="(min-width: 1600px) 180px, 22vw"
                    />
                </div>
            ) : (
                <ResponsiveImage
                    media={image}
                    className="portfolio__cover-image"
                    alt={alt}
                    sizes="(max-width: 700px) 92vw, (min-width: 1600px) 850px, 60vw"
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
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
