import React from 'react'
import {BsGithub} from 'react-icons/bs'
import {FiArrowLeft, FiArrowUpRight, FiExternalLink} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import ResponsiveImage from '../components/common/media/ResponsiveImage.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import {HOME_ASSETS} from '../config/homeAssets.js'
import {LINKS} from '../config/links.js'
import './CaseStudyPage.css'

const SOLUTION_ITEMS = ['architecture', 'media', 'quality']
const ARCHITECTURE_STEPS = ['entry', 'shell', 'routes', 'domains', 'media', 'vercel']
const DECISION_ITEMS = ['incremental', 'privacy', 'accessibility', 'adapters']
const CHALLENGE_ITEMS = ['legacy', 'interactive', 'editorial']
const RESULT_ITEMS = ['delivery', 'performance', 'media', 'rgaa']
const LIMIT_ITEMS = ['deployment', 'mediaDelivery', 'securityHeaders', 'cv', 'font', 'fieldData']
const STACK = ['React', 'Vite', 'React Router', 'i18next', 'Vitest', 'axe-core', 'Vercel']

export default function MyWebsiteCaseStudyPage() {
    const {t} = useTranslation('projects')
    useDocumentTitle(t('website.meta.title'))

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('website.hero.kicker')}
                title={t('website.hero.title')}
                subtitle={t('website.hero.subtitle')}
            >
                <Link className="btn case-study__button" to="/#portfolio">
                    <FiArrowLeft aria-hidden="true" />
                    {t('website.hero.back')}
                </Link>
                <a
                    className="btn case-study__button"
                    href={LINKS.demos.myWebsite}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FiExternalLink aria-hidden="true" />
                    {t('website.hero.live')}
                </a>
                <a
                    className="btn btn-primary case-study__button"
                    href={LINKS.projects.myWebsite}
                    target="_blank"
                    rel="noreferrer"
                >
                    <BsGithub aria-hidden="true" />
                    {t('website.hero.code')}
                </a>
            </PageHero>

            <article className="case-study">
                <div className="container case-study__visual">
                    <ResponsiveImage
                        media={HOME_ASSETS.portfolio.myWebsite}
                        alt={t('website.hero.imageAlt')}
                        sizes="(max-width: 900px) 92vw, 1100px"
                        loading="eager"
                        fetchPriority="high"
                    />
                </div>

                <dl className="container case-study__overview">
                    {['status', 'role', 'scope'].map((item) => (
                        <div key={item}>
                            <dt>{t(`website.overview.${item}Label`)}</dt>
                            <dd>{t(`website.overview.${item}`)}</dd>
                        </div>
                    ))}
                </dl>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.problem.kicker')}</p>
                    <h2>{t('website.problem.title')}</h2>
                    <p className="case-study__lead">{t('website.problem.body')}</p>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.solution.kicker')}</p>
                    <h2>{t('website.solution.title')}</h2>
                    <p className="case-study__lead">{t('website.solution.intro')}</p>
                    <div className="case-study__grid">
                        {SOLUTION_ITEMS.map((item) => (
                            <div key={item} className="case-study__card">
                                <h3>{t(`website.solution.items.${item}.title`)}</h3>
                                <p>{t(`website.solution.items.${item}.body`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.architecture.kicker')}</p>
                    <h2>{t('website.architecture.title')}</h2>
                    <ol className="case-study__flow">
                        {ARCHITECTURE_STEPS.map((step, index) => (
                            <li key={step}>
                                <span aria-hidden="true">{index + 1}</span>
                                <p>{t(`website.architecture.steps.${step}`)}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.decisions.kicker')}</p>
                    <h2>{t('website.decisions.title')}</h2>
                    <div className="case-study__grid case-study__grid--two-columns">
                        {DECISION_ITEMS.map((item) => (
                            <div key={item} className="case-study__card">
                                <h3>{t(`website.decisions.items.${item}.title`)}</h3>
                                <p>{t(`website.decisions.items.${item}.body`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.challenges.kicker')}</p>
                    <h2>{t('website.challenges.title')}</h2>
                    <div className="case-study__grid">
                        {CHALLENGE_ITEMS.map((item) => (
                            <div key={item} className="case-study__card">
                                <h3>{t(`website.challenges.items.${item}.title`)}</h3>
                                <p>{t(`website.challenges.items.${item}.body`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container case-study__section case-study__limits">
                    <p className="section-kicker">{t('website.results.kicker')}</p>
                    <h2>{t('website.results.title')}</h2>
                    <ul>
                        {RESULT_ITEMS.map((item) => (
                            <li key={item}>{t(`website.results.items.${item}`)}</li>
                        ))}
                    </ul>
                </section>

                <section className="container case-study__section case-study__limits">
                    <p className="section-kicker">{t('website.limits.kicker')}</p>
                    <h2>{t('website.limits.title')}</h2>
                    <ul>
                        {LIMIT_ITEMS.map((item) => (
                            <li key={item}>{t(`website.limits.items.${item}`)}</li>
                        ))}
                    </ul>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('website.stack.kicker')}</p>
                    <h2>{t('website.stack.title')}</h2>
                    <ul className="case-study__stack" aria-label={t('website.stack.title')}>
                        {STACK.map((technology) => (
                            <li key={technology}>{technology}</li>
                        ))}
                    </ul>
                </section>

                <aside className="container case-study__next">
                    <div>
                        <h2>{t('website.next.title')}</h2>
                        <p>{t('website.next.body')}</p>
                    </div>
                    <Link className="btn btn-primary case-study__button" to="/#portfolio">
                        {t('website.next.cta')}
                        <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </aside>
            </article>
        </PageFrame>
    )
}
