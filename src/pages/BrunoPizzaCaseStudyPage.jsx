import React from 'react'
import {BsGithub} from 'react-icons/bs'
import {FiArrowLeft, FiArrowUpRight} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import ResponsiveImage from '../components/common/media/ResponsiveImage.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import {HOME_ASSETS} from '../config/homeAssets.js'
import {LINKS} from '../config/links.js'
import './CaseStudyPage.css'

const SOLUTION_ITEMS = ['dashboard', 'workshop', 'settings']
const ARCHITECTURE_STEPS = ['excel', 'react', 'express', 'sqlite', 'electron']
const DECISION_ITEMS = ['local', 'persistence', 'quality']
const LIMIT_ITEMS = ['excel', 'trust', 'signing']
const STACK = ['React', 'TypeScript', 'Electron', 'Express', 'SQLite', 'Vite']

export default function BrunoPizzaCaseStudyPage() {
    const {t} = useTranslation('projects')
    useDocumentTitle(t('bruno.meta.title'))

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('bruno.hero.kicker')}
                title={t('bruno.hero.title')}
                subtitle={t('bruno.hero.subtitle')}
            >
                <Link className="btn case-study__button" to="/#portfolio">
                    <FiArrowLeft aria-hidden="true" />
                    {t('bruno.hero.back')}
                </Link>
                <a
                    className="btn btn-primary case-study__button"
                    href={LINKS.projects.brunoPizza}
                    target="_blank"
                    rel="noreferrer"
                >
                    <BsGithub aria-hidden="true" />
                    {t('bruno.hero.code')}
                </a>
            </PageHero>

            <article className="case-study">
                <div className="container case-study__visual">
                    <ResponsiveImage
                        media={HOME_ASSETS.portfolio.brunoPizza}
                        alt={t('bruno.hero.imageAlt')}
                        sizes="(max-width: 900px) 92vw, 1100px"
                        loading="eager"
                        fetchPriority="high"
                    />
                </div>

                <dl className="container case-study__overview">
                    {['status', 'role', 'scope'].map((item) => (
                        <div key={item}>
                            <dt>{t(`bruno.overview.${item}Label`)}</dt>
                            <dd>{t(`bruno.overview.${item}`)}</dd>
                        </div>
                    ))}
                </dl>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('bruno.problem.kicker')}</p>
                    <h2>{t('bruno.problem.title')}</h2>
                    <p className="case-study__lead">{t('bruno.problem.body')}</p>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('bruno.solution.kicker')}</p>
                    <h2>{t('bruno.solution.title')}</h2>
                    <p className="case-study__lead">{t('bruno.solution.intro')}</p>
                    <div className="case-study__grid">
                        {SOLUTION_ITEMS.map((item) => (
                            <div key={item} className="case-study__card">
                                <h3>{t(`bruno.solution.items.${item}.title`)}</h3>
                                <p>{t(`bruno.solution.items.${item}.body`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('bruno.architecture.kicker')}</p>
                    <h2>{t('bruno.architecture.title')}</h2>
                    <ol className="case-study__flow">
                        {ARCHITECTURE_STEPS.map((step, index) => (
                            <li key={step}>
                                <span aria-hidden="true">{index + 1}</span>
                                <p>{t(`bruno.architecture.steps.${step}`)}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('bruno.decisions.kicker')}</p>
                    <h2>{t('bruno.decisions.title')}</h2>
                    <div className="case-study__grid">
                        {DECISION_ITEMS.map((item) => (
                            <div key={item} className="case-study__card">
                                <h3>{t(`bruno.decisions.items.${item}.title`)}</h3>
                                <p>{t(`bruno.decisions.items.${item}.body`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="container case-study__section case-study__limits">
                    <p className="section-kicker">{t('bruno.limits.kicker')}</p>
                    <h2>{t('bruno.limits.title')}</h2>
                    <ul>
                        {LIMIT_ITEMS.map((item) => (
                            <li key={item}>{t(`bruno.limits.items.${item}`)}</li>
                        ))}
                    </ul>
                </section>

                <section className="container case-study__section">
                    <p className="section-kicker">{t('bruno.stack.kicker')}</p>
                    <h2>{t('bruno.stack.title')}</h2>
                    <ul className="case-study__stack" aria-label={t('bruno.stack.title')}>
                        {STACK.map((technology) => (
                            <li key={technology}>{technology}</li>
                        ))}
                    </ul>
                </section>

                <aside className="container case-study__next">
                    <div>
                        <h2>{t('bruno.next.title')}</h2>
                        <p>{t('bruno.next.body')}</p>
                    </div>
                    <Link className="btn btn-primary case-study__button" to="/#portfolio">
                        {t('bruno.next.cta')}
                        <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </aside>
            </article>
        </PageFrame>
    )
}
