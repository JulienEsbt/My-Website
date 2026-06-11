import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import PageNav from '../components/common/navigation/pageNav/PageNav'
import PageHero from '../components/common/layout/pageHero/PageHero'
import ReflectionFilters from '../features/reflections/reflectionFilters/ReflectionFilters.jsx'
import ReflectionList from '../features/reflections/reflectionList/ReflectionList.jsx'
import ReflectionStats from '../features/reflections/reflectionStats/ReflectionStats.jsx'
import ReflectionAuthor from '../features/reflections/reflectionAuthor/ReflectionAuthor.jsx'
import Fuse from 'fuse.js'
import reflections from '../data/reflections/reflections.js'

const ReflectionsPage = () => {
    const {t, i18n} = useTranslation('reflections')
    const [activeFilter, setActiveFilter] = useState('all')
    const [search, setSearch] = useState('')

    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'

    // const filters = [
    //     {value: 'all', label: t('filters.all')},
    //     {value: 'philosophy', label: t('filters.philosophy')},
    //     {value: 'politics', label: t('filters.politics')},
    //     {value: 'society', label: t('filters.society')},
    //     {value: 'technology', label: t('filters.technology')},
    // ]

    const categoryCount = new Set(reflections.map((item) => item.category)).size

    const categoryCounters = {
        philosophy: reflections.filter(r => r.category === 'philosophy').length,
        politics: reflections.filter(r => r.category === 'politics').length,
        society: reflections.filter(r => r.category === 'society').length,
        technology: reflections.filter(r => r.category === 'technology').length,
    }

    const filters = [
        {
            value: 'all',
            label: `${t('filters.all')} (${reflections.length})`
        },
        {
            value: 'philosophy',
            label: `${t('filters.philosophy')} (${categoryCounters.philosophy})`
        },
        {
            value: 'politics',
            label: `${t('filters.politics')} (${categoryCounters.politics})`
        },
        {
            value: 'society',
            label: `${t('filters.society')} (${categoryCounters.society})`
        },
        {
            value: 'technology',
            label: `${t('filters.technology')} (${categoryCounters.technology})`
        }
    ]

    const latestReflexion = [...reflections].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    )[0]

    const stats = [
        {label: t('stats.articles'), value: reflections.length},
        {label: t('stats.themes'), value: categoryCount},
        {
            label: t('stats.latest'),
            value: latestReflexion?.title[language] ?? '-',
        },
    ]

    const filteredReflexions = useMemo(() => {
        const byFilter = activeFilter === 'all'
            ? reflections
            : reflections.filter((reflexion) => reflexion.category === activeFilter)

        if (!search.trim()) {
            return byFilter
        }

        const fuse = new Fuse(byFilter, {
            keys: [
                `title.${language}`,
                `excerpt.${language}`,
                'category',
                'slug',
            ],
            threshold: 0.35,
        })

        return fuse.search(search).map((result) => result.item)
    }, [activeFilter, search, language])

    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>

                <PageHero
                    kicker={t('hero.kicker')}
                    title={t('hero.title')}
                    subtitle={t('hero.subtitle')}
                />

                <ReflectionStats items={stats}/>

                <section id="themes" className="reflexions-themes">
                    <h5>{t('themes.kicker')}</h5>
                    <h2>{t('themes.title')}</h2>

                    <div className="container reflexion-search">
                        <input
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
                </section>

                <ReflectionList
                    reflexions={filteredReflexions}
                    language={language}
                    categoryLabels={t('categories', {returnObjects: true})}
                    readLabel={t('card.read')}
                    emptyTitle={t('empty.title')}
                    emptyText={t('empty.text')}
                />

                <ReflectionAuthor/>
            </main>
        </>
    )
}

export default ReflectionsPage