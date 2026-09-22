import {useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {
    FiArrowDown,
    FiArrowUpRight,
    FiBookOpen,
    FiGitBranch,
    FiSearch,
    FiCompass,
} from 'react-icons/fi'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import {Link} from '../components/common/navigation/LocalizedLink.jsx'
import {citizenResources} from '../data/citizenResources/resources.js'
import CivicSectionNav from '../features/citizenResources/CivicSectionNav.jsx'
import useCivicMotion from '../features/citizenResources/useCivicMotion.js'
import ResourceScene from '../features/citizenResources/ResourceScene.jsx'
import '../features/citizenResources/CitizenResources.css'

const featuredResources = citizenResources.filter((resource) => resource.featured)
const furtherResources = citizenResources.filter((resource) => !resource.featured)

export default function ResourcesPage() {
    const {t} = useTranslation('resources')
    const pageRef = useRef(null)
    useCivicMotion(pageRef)
    return (
        <PageFrame>
            <div className="civic-page" ref={pageRef}>
                <header className="civic-hero container" id="top">
                    <div className="civic-hero__copy">
                        <p className="civic-eyebrow">
                            <FiCompass aria-hidden="true" />
                            {t('hero.kicker')}
                        </p>
                        <h1>
                            {t('hero.title')
                                .split('\n')
                                .map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        {index === 0 && ' '}
                                    </span>
                                ))}
                        </h1>
                        <p className="civic-hero__intro">{t('hero.intro')}</p>
                        <p className="civic-hero__context">{t('hero.context')}</p>
                        <p className="civic-hero__invitation">{t('hero.invitation')}</p>
                        <a className="civic-button" href="#selection">
                            {t('hero.cta')}
                            <FiArrowDown aria-hidden="true" />
                        </a>
                    </div>
                    <aside className="civic-hero__index" aria-label={t('nav.label')}>
                        <span className="civic-hero__index-mark" aria-hidden="true">
                            ↗
                        </span>
                        <nav>
                            {['approach', 'featured', 'projects', 'more'].map((item, index) => (
                                <a
                                    key={item}
                                    href={`#${['approach', 'selection', 'projects', 'further'][index]}`}
                                >
                                    <span aria-hidden="true">0{index + 1}</span>
                                    {t(`nav.${item}`)}
                                    <FiArrowDown aria-hidden="true" />
                                </a>
                            ))}
                        </nav>
                        <p>{t('hero.signature')}</p>
                    </aside>
                </header>

                <CivicSectionNav />

                <section
                    className="civic-section civic-approach container"
                    id="approach"
                    aria-labelledby="approach-title"
                >
                    <div className="civic-approach__copy" data-civic-reveal>
                        <p className="civic-eyebrow">{t('approach.eyebrow')}</p>
                        <h2 id="approach-title">{t('approach.title')}</h2>
                        <p>{t('approach.body')}</p>
                        <p>{t('approach.intent')}</p>
                        <p>{t('approach.humility')}</p>
                        <Link className="civic-text-link" to="/reflections">
                            <FiBookOpen aria-hidden="true" />
                            {t('pageNav.reflections', {ns: 'common'})}
                            <FiArrowUpRight aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="civic-approach__principles" data-civic-reveal>
                        {t('approach.principles', {returnObjects: true}).map((principle, index) => (
                            <div key={principle.title}>
                                <span aria-hidden="true">0{index + 1}</span>
                                <h3>{principle.title}</h3>
                                <p>{principle.body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="civic-approach__contact">
                        <p>
                            {t('approach.contact')}{' '}
                            <Link to="/#contact">
                                {t('approach.cta')}
                                <FiArrowUpRight aria-hidden="true" />
                            </Link>
                        </p>
                        <small>{t('approach.privacy')}</small>
                    </div>
                </section>

                <section
                    className="civic-section container"
                    id="selection"
                    aria-labelledby="selection-title"
                >
                    <div className="civic-section__heading" data-civic-reveal>
                        <p className="civic-eyebrow">{t('featured.eyebrow')}</p>
                        <h2 id="selection-title">{t('featured.title')}</h2>
                        <p>{t('featured.intro')}</p>
                    </div>
                    <ResourceScene resources={featuredResources} />
                </section>

                <section
                    className="civic-section container"
                    id="projects"
                    aria-labelledby="projects-title"
                >
                    <div className="civic-section__heading" data-civic-reveal>
                        <p className="civic-eyebrow">{t('projects.eyebrow')}</p>
                        <h2 id="projects-title">{t('projects.title')}</h2>
                        <p>{t('projects.intro')}</p>
                    </div>
                    <div className="civic-projects">
                        <article className="civic-project" data-civic-reveal>
                            <FiGitBranch className="civic-project__icon" aria-hidden="true" />
                            <p className="civic-project__status">{t('projects.agora.status')}</p>
                            <h3>{t('projects.agora.name')}</h3>
                            <span className="civic-project__label">
                                {t('projects.agora.label')}
                            </span>
                            <p>{t('projects.agora.description')}</p>
                            <p className="civic-project__intention">
                                {t('projects.agora.intention')}
                            </p>
                            <Link to="/#agora-project-title">
                                {t('projects.agora.cta')}
                                <FiArrowUpRight aria-hidden="true" />
                            </Link>
                        </article>
                        <article className="civic-project" data-civic-reveal>
                            <FiSearch className="civic-project__icon" aria-hidden="true" />
                            <p className="civic-project__status">
                                {t('projects.observatory.status')}
                            </p>
                            <h3>{t('projects.observatory.name')}</h3>
                            <span className="civic-project__label">
                                {t('projects.observatory.label')}
                            </span>
                            <p>{t('projects.observatory.description')}</p>
                            <p className="civic-project__intention">
                                {t('projects.observatory.intention')}
                            </p>
                            <details>
                                <summary>{t('projects.observatory.details')}</summary>
                                <p>{t('projects.observatory.future')}</p>
                                <a href="#resource-medias">
                                    {t('projects.observatory.source')}
                                    <FiArrowUpRight aria-hidden="true" />
                                </a>
                            </details>
                        </article>
                    </div>
                </section>

                <section
                    className="civic-section container"
                    id="further"
                    aria-labelledby="further-title"
                >
                    <div className="civic-section__heading" data-civic-reveal>
                        <p className="civic-eyebrow">{t('more.eyebrow')}</p>
                        <h2 id="further-title">{t('more.title')}</h2>
                        <p>{t('more.intro')}</p>
                    </div>
                    <ResourceScene resources={furtherResources} variant="more" />
                </section>
            </div>
        </PageFrame>
    )
}
