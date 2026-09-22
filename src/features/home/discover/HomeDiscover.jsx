import React from 'react'
import {FiArrowUpRight, FiClock, FiBookOpen} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import reflections from '../../../data/reflections/reflections.js'
import {formatDate} from '../../../i18n/formatters.js'
import HomeTravelCarousel from './HomeTravelCarousel.jsx'
import CitizenResourcesLink from '../../citizenResources/CitizenResourcesLink.jsx'
import './HomeDiscover.css'

const selected = [...reflections].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2)

export default function HomeDiscover() {
    const {t, i18n} = useTranslation('home')
    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'
    return (
        <>
            <section id="home-reflections" className="container home-discover">
                <div className="home-discover__heading">
                    <div>
                        <p className="section-kicker">
                            {language === 'fr' ? 'Au fil des idées' : 'Following ideas'}
                        </p>
                        <h2>{t('discover.reflectionsTitle')}</h2>
                        <p className="home-discover__intro">{t('discover.reflectionsIntro')}</p>
                    </div>
                    <Link className="home-discover__all" to="/reflections">
                        {t('discover.allReflections')} <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </div>
                <div className="home-discover__grid">
                    {selected.map((entry) => (
                        <article className="home-discover__essay" key={entry.slug}>
                            <div className="home-discover__meta">
                                <span className="home-discover__index" aria-hidden="true">
                                    <FiBookOpen />
                                </span>
                                <span className="home-discover__duration">
                                    <FiClock aria-hidden="true" />
                                    {entry.readingTime} min
                                </span>
                            </div>
                            <h3>
                                <Link
                                    to={`/reflections/${entry.slug}`}
                                    state={{fromHome: 'reflections'}}
                                >
                                    {entry.title[language]}
                                </Link>
                            </h3>
                            <p className="home-discover__excerpt">{entry.excerpt[language]}</p>
                            <div className="home-discover__essay-footer">
                                <time dateTime={entry.date}>
                                    {formatDate(entry.date, language)}
                                </time>
                                <span className="home-discover__arrow" aria-hidden="true">
                                    <FiArrowUpRight />
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
                <CitizenResourcesLink copy={t('citizenResources', {returnObjects: true})} />
            </section>
            <section id="home-travel" className="container home-discover">
                <div className="home-discover__heading">
                    <div>
                        <p className="section-kicker">
                            {language === 'fr' ? 'Au-delà du quotidien' : 'Beyond the everyday'}
                        </p>
                        <h2>{t('discover.travelTitle')}</h2>
                        <p className="home-discover__intro">{t('discover.travelIntro')}</p>
                    </div>
                    <Link className="home-discover__all" to="/travel">
                        {t('discover.allTravel')} <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </div>
                <HomeTravelCarousel language={language} readLabel={t('discover.readStory')} />
            </section>
        </>
    )
}
