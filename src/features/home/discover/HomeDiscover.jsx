import React from 'react'
import {FiArrowUpRight, FiArrowRight, FiClock, FiMapPin} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import reflections from '../../../data/reflections/reflections.js'
import trips from '../../../data/travel/trips.js'
import {formatDate} from '../../../i18n/formatters.js'
import albumManifest from '../../../generated/media/travels/croatia-2021.json'
import {createMediaResolver} from '../../../config/media.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import './HomeDiscover.css'

const travelPhoto = createMediaResolver(albumManifest, 'travels')('croatia-2021/IMG_7060.jpeg')

const selected = [...reflections].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2)
const trip = trips.find((item) => item.id === 'croatia-2021')

export default function HomeDiscover() {
    const {t, i18n} = useTranslation('home')
    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'
    const fr = language === 'fr'
    return (
        <>
            <section id="home-reflections" className="container home-discover">
                <div className="home-discover__heading">
                    <div>
                        <h2>{t('discover.reflectionsTitle')}</h2>
                        <p className="home-discover__intro">{t('discover.reflectionsIntro')}</p>
                    </div>
                    <Link className="home-discover__all" to="/reflections">
                        {t('discover.allReflections')} <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </div>
                <div className="home-discover__grid">
                    {selected.map((entry, index) => (
                        <article className="home-discover__essay" key={entry.slug}>
                            <div className="home-discover__meta">
                                <span className="home-discover__index" aria-hidden="true">
                                    0{index + 1}
                                </span>
                                <span className="home-discover__duration">
                                    <FiClock aria-hidden="true" />
                                    {entry.readingTime} min
                                </span>
                            </div>
                            <h3>
                                <Link to={`/reflections/${entry.slug}`}>
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
            </section>
            <section id="home-travel" className="container home-discover">
                <div className="home-discover__heading">
                    <div>
                        <h2>{t('discover.travelTitle')}</h2>
                        <p className="home-discover__intro">{t('discover.travelIntro')}</p>
                    </div>
                    <Link className="home-discover__all" to="/travel">
                        {t('discover.allTravel')} <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </div>
                <article className="home-discover__travel">
                    <div className="home-discover__photo">
                        <ResponsiveImage
                            media={travelPhoto}
                            alt={
                                fr
                                    ? 'Souvenir de voyage à Dubrovnik, 2021'
                                    : 'Travel memory from Dubrovnik, 2021'
                            }
                            sizes="(max-width: 700px) 90vw, 44vw"
                        />
                        <span className="home-discover__location">
                            <FiMapPin aria-hidden="true" />
                            {fr ? trip.country : trip.countryEn} · {trip.year}
                        </span>
                    </div>
                    <div className="home-discover__travel-copy">
                        <p className="home-discover__date">
                            {fr ? trip.dateLabel : trip.dateLabelEn}
                        </p>
                        <h3>
                            {fr ? trip.city : trip.cityEn} · {fr ? trip.country : trip.countryEn}
                        </h3>
                        <p>{fr ? trip.description : trip.descriptionEn}</p>
                        <Link className="home-discover__story-link" to={`/travel/${trip.id}`}>
                            {t('discover.readStory')} <FiArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                </article>
            </section>
        </>
    )
}
