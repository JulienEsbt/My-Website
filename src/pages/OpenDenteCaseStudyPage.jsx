import {useTranslation} from 'react-i18next'
import {BsGithub} from 'react-icons/bs'
import {
    FiArrowDown,
    FiArrowLeft,
    FiArrowUpRight,
    FiBatteryCharging,
    FiGlobe,
    FiMonitor,
} from 'react-icons/fi'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import ResponsiveImage from '../components/common/media/ResponsiveImage.jsx'
import {Link} from '../components/common/navigation/LocalizedLink.jsx'
import {LINKS} from '../config/links.js'
import {OPENDENTE_PANELS} from '../config/opendenteMedia.js'
import OpenDenteGallery from '../features/projects/openDente/OpenDenteGallery.jsx'
import './CaseStudyPage.css'
import './OpenDenteCaseStudyPage.css'

const CONTRIBUTIONS = [
    ['daily', FiBatteryCharging],
    ['interface', FiGlobe],
    ['background', FiMonitor],
]
const STACK = ['Swift 6', 'SwiftUI', 'XPC', 'IOKit', 'XCTest', 'XcodeGen']

export default function OpenDenteCaseStudyPage() {
    const {t, i18n} = useTranslation('projects')
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'

    return (
        <PageFrame>
            <div className="opendente-page">
                <PageHero
                    id="top"
                    kicker={t('opendente.hero.kicker')}
                    title={t('opendente.hero.title')}
                    subtitle={t('opendente.hero.subtitle')}
                    visual={
                        <div className="opendente-hero__panels">
                            <ResponsiveImage
                                media={OPENDENTE_PANELS[language].light}
                                alt={t('opendente.hero.lightAlt')}
                                className="opendente-hero__light"
                                sizes="(min-width: 1100px) 240px, 35vw"
                                loading="eager"
                            />
                            <ResponsiveImage
                                media={OPENDENTE_PANELS[language].dark}
                                alt={t('opendente.hero.darkAlt')}
                                className="opendente-hero__dark"
                                sizes="(min-width: 1100px) 320px, 48vw"
                                loading="eager"
                                fetchPriority="high"
                            />
                            <span className="opendente-hero__caption">
                                {t('opendente.hero.caption')}
                            </span>
                        </div>
                    }
                    footer={
                        <ul
                            className="opendente-hero__facts"
                            aria-label={t('opendente.hero.factsLabel')}
                        >
                            {['native', 'languages', 'local'].map((item) => (
                                <li key={item}>{t(`opendente.hero.${item}`)}</li>
                            ))}
                        </ul>
                    }
                >
                    <a className="btn btn-primary case-study__button" href="#explore">
                        <FiArrowDown aria-hidden="true" />
                        {t('opendente.hero.explore')}
                    </a>
                    <a
                        className="btn case-study__button"
                        href={LINKS.projects.openDente}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <BsGithub aria-hidden="true" />
                        {t('opendente.hero.code')}
                    </a>
                    <Link className="opendente-hero__back" to="/#portfolio">
                        <FiArrowLeft aria-hidden="true" />
                        {t('opendente.hero.back')}
                    </Link>
                </PageHero>

                <article className="case-study">
                    <dl className="container case-study__overview">
                        {['status', 'role', 'scope'].map((item) => (
                            <div key={item}>
                                <dt>{t(`opendente.overview.${item}Label`)}</dt>
                                <dd>{t(`opendente.overview.${item}`)}</dd>
                            </div>
                        ))}
                    </dl>

                    <section className="container case-study__section">
                        <p className="section-kicker">{t('opendente.intent.kicker')}</p>
                        <h2>{t('opendente.intent.title')}</h2>
                        <p className="case-study__lead">{t('opendente.intent.body')}</p>
                        <div className="case-study__grid">
                            {CONTRIBUTIONS.map(([id, Icon]) => (
                                <div key={id} className="case-study__card opendente-contribution">
                                    <Icon aria-hidden="true" />
                                    <h3>{t(`opendente.contributions.${id}.title`)}</h3>
                                    <p>{t(`opendente.contributions.${id}.body`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <OpenDenteGallery />

                    <section
                        className="container case-study__section"
                        aria-labelledby="opendente-engineering-title"
                    >
                        <p className="section-kicker">{t('opendente.engineering.kicker')}</p>
                        <h2 id="opendente-engineering-title">{t('opendente.engineering.title')}</h2>
                        <p className="case-study__lead">{t('opendente.engineering.body')}</p>
                        <ol className="case-study__flow">
                            {['app', 'helper', 'system'].map((id, index) => (
                                <li key={id}>
                                    <span aria-hidden="true">{index + 1}</span>
                                    <p>{t(`opendente.engineering.steps.${id}`)}</p>
                                </li>
                            ))}
                        </ol>
                        <ul
                            className="case-study__stack"
                            aria-label={t('opendente.engineering.stackLabel')}
                        >
                            {STACK.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section
                        className="container case-study__section opendente-context"
                        aria-labelledby="opendente-context-title"
                    >
                        <div>
                            <p className="section-kicker">{t('opendente.context.kicker')}</p>
                            <h2 id="opendente-context-title">{t('opendente.context.title')}</h2>
                            <p>{t('opendente.context.body')}</p>
                            <a
                                href={`${LINKS.projects.openDente}/blob/main/VALIDATION.md`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('opendente.context.validation')}
                                <FiArrowUpRight aria-hidden="true" />
                            </a>
                        </div>
                        <div>
                            <h3>{t('opendente.credits.title')}</h3>
                            <p>
                                {t('opendente.credits.before')}{' '}
                                <a
                                    href="https://github.com/killerk3emstar/OpenDente"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    killerk3emstar/OpenDente
                                </a>
                                {t('opendente.credits.after')}
                            </p>
                            <p>{t('opendente.credits.license')}</p>
                        </div>
                    </section>

                    <aside className="container case-study__next">
                        <div>
                            <h2>{t('opendente.next.title')}</h2>
                            <p>{t('opendente.next.body')}</p>
                        </div>
                        <a
                            className="btn btn-primary case-study__button"
                            href={LINKS.projects.openDente}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('opendente.next.cta')}
                            <FiArrowUpRight aria-hidden="true" />
                        </a>
                    </aside>
                </article>
            </div>
        </PageFrame>
    )
}
