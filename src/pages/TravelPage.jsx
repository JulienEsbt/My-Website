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
import {FiArrowDown, FiArrowUpRight, FiMap, FiChevronDown} from 'react-icons/fi'
import useMediaQuery from '../components/common/accessibility/useMediaQuery.js'
import MobileDisclosure from '../components/common/mobile/MobileDisclosure.jsx'
import HomeTravelCarousel from '../features/home/discover/HomeTravelCarousel.jsx'

const TravelPage = () => {
    const {t, i18n} = useTranslation('travel')
    const fr = i18n.language.startsWith('fr')
    const {tripId} = useParams()
    const mobile = useMediaQuery('(max-width: 700px)')

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
                <a
                    className="entry-action entry-action--quiet"
                    href={mobile ? '#mobile-travel-map' : '#travel-explorer'}
                >
                    {t('actions.map')}
                    <FiArrowUpRight aria-hidden="true" />
                </a>
            </PageHero>
            <TravelNav />
            {mobile ? (
                <>
                    <MobileDisclosure
                        id="mobile-travel-map"
                        summaryClassName="mobile-map-invitation"
                        label={
                            <>
                                <FiMap aria-hidden="true" />
                                <span>
                                    <small>
                                        {fr
                                            ? 'Une autre façon de voyager'
                                            : 'Another way to explore'}
                                    </small>
                                    <strong>
                                        {fr
                                            ? 'Mon parcours, sur le globe'
                                            : 'My journey, on the globe'}
                                    </strong>
                                    <span>
                                        {fr
                                            ? 'Faites tourner le monde, explorez les lieux.'
                                            : 'Spin the world and explore the places.'}
                                    </span>
                                </span>
                                <FiChevronDown aria-hidden="true" />
                            </>
                        }
                    >
                        <TravelExplorer />
                    </MobileDisclosure>
                    <TravelTimeline routeTripId={tripId} />
                </>
            ) : (
                <>
                    <TravelExplorer />
                    <TravelTimeline routeTripId={tripId} />
                </>
            )}
            <DreamDestinations />
        </PageFrame>
    )
}

export default TravelPage
