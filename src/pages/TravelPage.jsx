import React from 'react'
import {useTranslation} from 'react-i18next'
import PageNav from '../components/common/navigation/pageNav/PageNav'
import PageHero from '../components/common/layout/pageHero/PageHero'
import TravelStats from '../features/travel/travelStats/TravelStats'
import TravelTimeline from '../features/travel/travelTimeline/TravelTimeline'
import DreamDestinations from '../features/travel/dreamDestinations/DreamDestinations'
import TravelExplorer from "../features/travel/travelExplorer/TravelExplorer.jsx";

const TravelPage = () => {
    const {t} = useTranslation('travel')

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

                <TravelStats/>
                <TravelExplorer/>
                <TravelTimeline/>
                <DreamDestinations/>
            </main>
        </>
    )
}

export default TravelPage