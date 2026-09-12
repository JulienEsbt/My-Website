import React from 'react'
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
                <h2>{t('discover.reflectionsTitle')}</h2>
                <p className="home-discover__intro">{t('discover.reflectionsIntro')}</p>
                <div className="home-discover__grid">
                    {selected.map((entry) => (
                        <article key={entry.slug}>
                            <time dateTime={entry.date}>{formatDate(entry.date, language)}</time>
                            <h3>
                                <Link to={`/reflections/${entry.slug}`}>
                                    {entry.title[language]}
                                </Link>
                            </h3>
                            <p>{entry.excerpt[language]}</p>
                        </article>
                    ))}
                </div>
                <Link className="btn" to="/reflections">
                    {t('discover.allReflections')}
                </Link>
            </section>
            <section id="home-travel" className="container home-discover">
                <h2>{t('discover.travelTitle')}</h2>
                <p className="home-discover__intro">{t('discover.travelIntro')}</p>
                <article className="home-discover__travel">
                    <ResponsiveImage
                        media={travelPhoto}
                        alt={
                            fr
                                ? 'Souvenir de voyage à Dubrovnik, 2021'
                                : 'Travel memory from Dubrovnik, 2021'
                        }
                        sizes="(max-width: 700px) 88vw, 520px"
                    />
                    <div>
                        <p>{fr ? trip.dateLabel : trip.dateLabelEn}</p>
                        <h3>
                            {fr ? trip.city : trip.cityEn} · {fr ? trip.country : trip.countryEn}
                        </h3>
                        <p>{fr ? trip.description : trip.descriptionEn}</p>
                        <Link className="btn" to={`/travel/${trip.id}`}>
                            {t('discover.readStory')}
                        </Link>
                    </div>
                </article>
                <Link className="btn" to="/travel">
                    {t('discover.allTravel')}
                </Link>
            </section>
        </>
    )
}
