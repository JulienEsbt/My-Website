import useMediaQuery from '../components/common/accessibility/useMediaQuery.js'
import React, {useMemo, useState} from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import PageHero from '../components/common/layout/pageHero/PageHero'
import ReflectionFilters from '../features/reflections/reflectionFilters/ReflectionFilters.jsx'
import ReflectionList from '../features/reflections/reflectionList/ReflectionList.jsx'
import ReflectionStats from '../features/reflections/reflectionStats/ReflectionStats.jsx'
import ReflectionAuthor from '../features/reflections/reflectionAuthor/ReflectionAuthor.jsx'
import Fuse from 'fuse.js'
import reflections from '../data/reflections/reflections.js'
import ReflectionsNav from '../features/reflections/reflectionsNav/ReflectionsNav.jsx'
import CitizenResourcesLink from '../features/citizenResources/CitizenResourcesLink.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import {Link} from '../components/common/navigation/LocalizedLink.jsx'
import {FiArrowDown, FiArrowUpRight, FiBookOpen} from 'react-icons/fi'

const ReflectionsPage = () => {
    const {t, i18n} = useTranslation('reflections')
    const [activeFilter, setActiveFilter] = useState('all')
    const mobile = useMediaQuery('(max-width: 700px)')
    const [search, setSearch] = useState('')

    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'

    const categoryCount = new Set(reflections.map((item) => item.category)).size

    const categoryCounters = {
        philosophy: reflections.filter((r) => r.category === 'philosophy').length,
        politics: reflections.filter((r) => r.category === 'politics').length,
        society: reflections.filter((r) => r.category === 'society').length,
        technology: reflections.filter((r) => r.category === 'technology').length,
    }

    const filters = [
        {
            value: 'all',
            label: `${t('filters.all')} (${reflections.length})`,
        },
        {
            value: 'philosophy',
            label: `${t('filters.philosophy')} (${categoryCounters.philosophy})`,
        },
        {
            value: 'politics',
            label: `${t('filters.politics')} (${categoryCounters.politics})`,
        },
        {
            value: 'society',
            label: `${t('filters.society')} (${categoryCounters.society})`,
        },
        {
            value: 'technology',
            label: `${t('filters.technology')} (${categoryCounters.technology})`,
        },
    ]

    const latestReflexion = [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date))[0]

    const stats = [
        {label: t('stats.articles'), value: reflections.length},
        {label: t('stats.themes'), value: categoryCount},
    ]

    const filteredReflexions = useMemo(() => {
        const byFilter =
            activeFilter === 'all'
                ? reflections
                : reflections.filter((reflexion) => reflexion.category === activeFilter)

        const sortReflections = (items) => {
            return [...items].sort((a, b) => {
                return (
                    Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
                    new Date(b.date) - new Date(a.date)
                )
            })
        }

        if (!search.trim()) {
            return sortReflections(byFilter)
        }

        const fuse = new Fuse(byFilter, {
            keys: [`title.${language}`, `excerpt.${language}`, 'category', 'slug'],
            threshold: 0.35,
        })

        return sortReflections(fuse.search(search).map((result) => result.item))
    }, [activeFilter, search, language])

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                fullScreen
                footer={<ReflectionStats items={stats} />}
                visual={
                    !mobile &&
                    latestReflexion && (
                        <Link
                            className="reflection-entry-note"
                            to={`/reflections/${latestReflexion.slug}`}
                        >
                            <span className="reflection-entry-note__eyebrow">
                                <FiBookOpen aria-hidden="true" />
                                {t('stats.latest')}
                            </span>
                            <span className="reflection-entry-note__metadata">
                                <span>{t(`categories.${latestReflexion.category}`)}</span>
                                <time dateTime={latestReflexion.date}>
                                    {new Intl.DateTimeFormat(language, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        timeZone: 'UTC',
                                    }).format(new Date(latestReflexion.date))}
                                </time>
                            </span>
                            <h2>{latestReflexion.title[language]}</h2>
                            <p>{latestReflexion.excerpt[language]}</p>
                            <span className="reflection-entry-note__footer">
                                <span>
                                    {t('article.readingTime', {count: latestReflexion.readingTime})}
                                </span>
                                <span>
                                    {t('card.read')}
                                    <FiArrowUpRight aria-hidden="true" />
                                </span>
                            </span>
                        </Link>
                    )
                }
            >
                <a className="entry-action" href="#latest">
                    {t('actions.latest')}
                    <FiArrowDown aria-hidden="true" />
                </a>
                <a className="entry-action entry-action--quiet" href="#themes">
                    {t('actions.themes')}
                    <FiArrowUpRight aria-hidden="true" />
                </a>
            </PageHero>

            <ReflectionsNav />

            <motion.section
                id="themes"
                className="reflexions-themes"
                initial={{opacity: 0, y: 28, filter: 'blur(10px)'}}
                whileInView={{opacity: 1, y: 0, filter: 'blur(0px)'}}
                viewport={{once: true, amount: 0.25}}
                transition={{duration: 0.65, ease: 'easeOut'}}
            >
                <p className="section-kicker">{t('themes.kicker')}</p>
                <h2>{t('themes.title')}</h2>

                <div className="container reflexion-search">
                    <label className="sr-only" htmlFor="reflection-search">
                        {t('search.label')}
                    </label>
                    <input
                        id="reflection-search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('search.placeholder')}
                    />
                </div>

                <ReflectionFilters
                    filters={filters}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <p className="sr-only" role="status">
                    {t('search.results', {count: filteredReflexions.length})}
                </p>
            </motion.section>

            <ReflectionList
                reflexions={filteredReflexions}
                language={language}
                categoryLabels={t('categories', {returnObjects: true})}
                readLabel={t('card.read')}
                featuredLabel={t('card.featured')}
                getReadingTimeLabel={(count) => t('article.readingTime', {count})}
                emptyTitle={t('empty.title')}
                emptyText={t('empty.text')}
                kicker={t('latest.kicker')}
                title={t('latest.title')}
            />

            <div className="container">
                <CitizenResourcesLink copy={t('citizenResources', {returnObjects: true})} />
            </div>
            <ReflectionAuthor />
        </PageFrame>
    )
}

export default ReflectionsPage
