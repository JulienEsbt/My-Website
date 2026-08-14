import React from 'react'
import {useTranslation} from 'react-i18next'
import PageHero from '../components/common/layout/pageHero/PageHero'
import TravelStats from '../features/travel/travelStats/TravelStats'
import TravelTimeline from '../features/travel/travelTimeline/TravelTimeline'
import DreamDestinations from '../features/travel/dreamDestinations/DreamDestinations'
import TravelExplorer from '../features/travel/travelExplorer/TravelExplorer.jsx'
import TravelNav from '../features/travel/travelNav/TravelNav.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'

const TravelPage = () => {
    const {t} = useTranslation('travel')
    useDocumentTitle(t('meta.title'))

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
            />
            <TravelNav />
            <TravelStats />
            <TravelExplorer />
            <TravelTimeline />
            <DreamDestinations />
        </PageFrame>
    )
}

export default TravelPage
