import {useMemo, useState} from 'react'
import {FiArrowUpRight, FiRss} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import journalEntries from '../data/journal/journalEntries.js'
import './JournalPage.css'

const CATEGORIES = ['all', 'project', 'travel', 'reflection', 'sport']

export default function JournalPage() {
    const {t, i18n} = useTranslation('journal')
    const [activeCategory, setActiveCategory] = useState('all')
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'
    useDocumentTitle(t('meta.title'))

    const entries = useMemo(
        () =>
            activeCategory === 'all'
                ? journalEntries
                : journalEntries.filter((entry) => entry.category === activeCategory),
        [activeCategory]
    )
    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(language, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        [language]
    )
    const monthFormatter = useMemo(
        () => new Intl.DateTimeFormat(language, {month: 'long', year: 'numeric'}),
        [language]
    )

    const formatDate = (entry) =>
        (entry.datePrecision === 'month' ? monthFormatter : dateFormatter).format(
            new Date(`${entry.date}T12:00:00`)
        )

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
            />

            <section className="container journal-page" aria-labelledby="journal-feed-title">
                <div className="journal-page__toolbar">
                    <div>
                        <p className="section-kicker">{t('feed.kicker')}</p>
                        <h2 id="journal-feed-title">{t('feed.title')}</h2>
                    </div>
                    <div className="journal-page__feeds" aria-label={t('feeds.aria')}>
                        <a href="/rss.xml">
                            <FiRss aria-hidden="true" /> RSS
                        </a>
                        <a href="/atom.xml">
                            <FiRss aria-hidden="true" /> Atom
                        </a>
                    </div>
                </div>

                <div className="journal-page__filters" aria-label={t('filters.aria')}>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            aria-pressed={activeCategory === category}
                            onClick={() => setActiveCategory(category)}
                        >
                            {t(`filters.${category}`)}
                        </button>
                    ))}
                </div>

                <p className="sr-only" role="status">
                    {t('feed.results', {count: entries.length})}
                </p>

                {entries.length > 0 ? (
                    <ol className="journal-page__list">
                        {entries.map((entry) => (
                            <li key={entry.id}>
                                <article>
                                    <div className="journal-page__meta">
                                        <span>{t(`filters.${entry.category}`)}</span>
                                        <time dateTime={entry.date}>{formatDate(entry)}</time>
                                    </div>
                                    <h3>{entry.title[language] ?? entry.title.fr}</h3>
                                    <p>{entry.excerpt[language] ?? entry.excerpt.fr}</p>
                                    <Link to={entry.href}>
                                        {t('feed.read')} <FiArrowUpRight aria-hidden="true" />
                                    </Link>
                                </article>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className="journal-page__empty">
                        <h3>{t('empty.title')}</h3>
                        <p>{t('empty.text')}</p>
                    </div>
                )}
            </section>

            <aside
                className="container journal-page__follow"
                aria-labelledby="journal-follow-title"
            >
                <FiRss aria-hidden="true" />
                <div>
                    <p className="section-kicker">{t('follow.kicker')}</p>
                    <h2 id="journal-follow-title">{t('follow.title')}</h2>
                    <p>{t('follow.text')}</p>
                </div>
                <a href="/rss.xml">{t('follow.cta')}</a>
            </aside>
        </PageFrame>
    )
}
