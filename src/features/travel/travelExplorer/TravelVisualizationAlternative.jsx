import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import trips from '../../../data/travel/trips.js'
import dreamDestinations from '../../../data/travel/dreamDestinations.js'

const TravelVisualizationAlternative = () => {
    const {t, i18n} = useTranslation('travel')
    const isFr = i18n.resolvedLanguage?.startsWith('fr')

    const sortedTrips = useMemo(() => [...trips].sort((a, b) => a.sortOrder - b.sortOrder), [])
    const getText = (item, field) => (!isFr ? (item[`${field}En`] ?? item[field]) : item[field])

    return (
        <details className="travel-explorer__alternative">
            <summary>{t('explorer.alternative.summary')}</summary>

            <div className="travel-explorer__alternative-content">
                <p id="travel-visualization-alternative-description">
                    {t('explorer.alternative.description')}
                </p>

                <h3>{t('explorer.alternative.trips')}</h3>
                <ul>
                    {sortedTrips.map((trip) => (
                        <li key={trip.id}>
                            <span aria-hidden="true">{trip.flag}</span>
                            <div>
                                <strong>
                                    {getText(trip, 'city')}, {getText(trip, 'country')}
                                </strong>
                                <span>
                                    {getText(trip, 'dateLabel')} · {getText(trip, 'type')}
                                </span>
                                <p>{getText(trip, 'description')}</p>
                                <a
                                    href={`https://www.google.com/maps?q=${trip.lat},${trip.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('explorer.alternative.openLocation', {
                                        location: getText(trip, 'city'),
                                    })}
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>

                <h3>{t('explorer.alternative.dreams')}</h3>
                <ul>
                    {dreamDestinations.map((destination) => (
                        <li key={destination.id}>
                            <span aria-hidden="true">{destination.emoji}</span>
                            <div>
                                <strong>
                                    {getText(destination, 'name')},{' '}
                                    {getText(destination, 'country')}
                                </strong>
                                <span>{getText(destination, 'category')}</span>
                                <p>{getText(destination, 'reason')}</p>
                                <a
                                    href={`https://www.google.com/maps?q=${destination.lat},${destination.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('explorer.alternative.openLocation', {
                                        location: getText(destination, 'name'),
                                    })}
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </details>
    )
}

export default TravelVisualizationAlternative
