import React from 'react'
import {useTranslation} from 'react-i18next'
import PageNav from '../components/common/pagenav/PageNav'
import PageHero from '../components/common/pagehero/PageHero'
import TravelStats from '../components/travel/travelStats/TravelStats'
import TravelTimeline from '../components/travel/travelTimeline/TravelTimeline'
import DreamDestinations from '../components/travel/dreamDestinations/DreamDestinations'
import TravelExplorer from "../components/travel/travelExplorer/TravelExplorer.jsx";

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