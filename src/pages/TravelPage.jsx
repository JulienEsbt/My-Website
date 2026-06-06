import React from 'react'
import {useTranslation} from 'react-i18next'
import PageNav from '../components/common/pagenav/PageNav'
import PageHero from '../components/common/pagehero/PageHero'
import TravelMap from '../components/travel/travelMap/TravelMap'
import TravelTimeline from '../components/travel/travelTimeline/TravelTimeline'

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
                >
                    <a href="#map" className="btn btn-primary">
                        {t('actions.map')}
                    </a>
                    <a href="#stories" className="btn">
                        {t('actions.stories')}
                    </a>
                </PageHero>

                <TravelMap/>
                <TravelTimeline/>
            </main>
        </>
    )
}

export default TravelPage