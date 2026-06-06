import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import PageNav from '../components/common/pagenav/PageNav'
import PageHero from '../components/common/pagehero/PageHero'
import ReflexionFilters from '../components/reflexions/reflexionFilters/ReflexionFilters'
import ReflexionList from '../components/reflexions/reflexionList/ReflexionList'
import ReflexionStats from '../components/reflexions/reflexionStats/ReflexionStats'
import ReflexionAuthor from '../components/reflexions/reflexionAuthor/ReflexionAuthor'
import Fuse from 'fuse.js'
import reflexions from '../data/reflexions/reflexions'

const ReflexionsPage = () => {
    const {t, i18n} = useTranslation('reflexions')
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

    const categoryCount = new Set(reflexions.map((item) => item.category)).size

    const categoryCounters = {
        philosophy: reflexions.filter(r => r.category === 'philosophy').length,
        politics: reflexions.filter(r => r.category === 'politics').length,
        society: reflexions.filter(r => r.category === 'society').length,
        technology: reflexions.filter(r => r.category === 'technology').length,
    }

    const filters = [
        {
            value: 'all',
            label: `${t('filters.all')} (${reflexions.length})`
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

    const latestReflexion = [...reflexions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    )[0]

    const stats = [
        {label: t('stats.articles'), value: reflexions.length},
        {label: t('stats.themes'), value: categoryCount},
        {
            label: t('stats.latest'),
            value: latestReflexion?.title[language] ?? '-',
        },
    ]

    const filteredReflexions = useMemo(() => {
        const byFilter = activeFilter === 'all'
            ? reflexions
            : reflexions.filter((reflexion) => reflexion.category === activeFilter)

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

                <ReflexionStats items={stats}/>

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

                    <ReflexionFilters
                        filters={filters}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                </section>

                <ReflexionList
                    reflexions={filteredReflexions}
                    language={language}
                    categoryLabels={t('categories', {returnObjects: true})}
                    readLabel={t('card.read')}
                    emptyTitle={t('empty.title')}
                    emptyText={t('empty.text')}
                />

                <ReflexionAuthor/>
            </main>
        </>
    )
}

export default ReflexionsPage