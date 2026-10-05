import React from 'react'
import {useTranslation} from 'react-i18next'
import {useParams} from 'react-router-dom'
import PageHero from '../components/common/layout/pageHero/PageHero'
import TravelStats from '../features/travel/travelStats/TravelStats'
import TravelTimeline from '../features/travel/travelTimeline/TravelTimeline'
import DreamDestinations from '../features/travel/dreamDestinations/DreamDestinations'
import TravelExplorer from '../features/travel/travelExplorer/TravelExplorer.jsx'
import TravelNav from '../features/travel/travelNav/TravelNav.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import trips from '../data/travel/trips.js'
import {FiArrowDown, FiArrowUpRight} from 'react-icons/fi'
import HomeTravelCarousel from '../features/home/discover/HomeTravelCarousel.jsx'

const TravelPage = () => {
    const {t, i18n} = useTranslation('travel')
    const fr = i18n.language.startsWith('fr')
    const {tripId} = useParams()

    if (tripId && !trips.some(({id}) => id === tripId)) return <NotFoundPage />

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                fullScreen
                footer={<TravelStats />}
                visual={
                    <HomeTravelCarousel
                        variant="entry"
                        language={fr ? 'fr' : 'en'}
                        readLabel={t('hero.story')}
                    />
                }
            >
                <a className="entry-action" href="#stories">
                    {t('actions.stories')}
                    <FiArrowDown aria-hidden="true" />
                </a>
                <a className="entry-action entry-action--quiet" href="#travel-explorer">
                    {t('actions.map')}
                    <FiArrowUpRight aria-hidden="true" />
                </a>
            </PageHero>
            <TravelNav />
            <TravelExplorer />
            <TravelTimeline routeTripId={tripId} />
            <DreamDestinations />
        </PageFrame>
    )
}

export default TravelPage
