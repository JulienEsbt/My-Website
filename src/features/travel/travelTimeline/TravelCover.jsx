import {useEffect, useState} from 'react'
import {FiMapPin} from 'react-icons/fi'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {travelHighlights} from '../../../config/travelHighlights.js'
import {loadTripPhotos} from '../../../data/travel/photoAlbums.js'

export default function TravelCover({trip, isFr}) {
    const highlight = travelHighlights.find(({id}) => id === trip.id)
    const [photo, setPhoto] = useState(highlight?.photo ?? null)
    useEffect(() => {
        if (highlight) return
        let cancelled = false
        loadTripPhotos(trip.id)
            .then((photos) => {
                const landscape = photos.find(({src}) =>
                    src.variants?.some(({width, height}) => width > height)
                )
                if (!cancelled) setPhoto((landscape ?? photos[0])?.src ?? null)
            })
            .catch(() => {
                /* The written travel story remains available without its cover. */
            })
        return () => {
            cancelled = true
        }
    }, [trip.id, highlight])
    return (
        <span
            className={`travel-timeline__cover${photo ? '' : ' travel-timeline__cover--journal'}`}
            aria-hidden="true"
        >
            {photo ? (
                <ResponsiveImage
                    media={photo}
                    alt=""
                    sizes="100px"
                    loading="lazy"
                    style={{objectPosition: highlight?.photoPosition ?? 'center'}}
                />
            ) : (
                <>
                    <FiMapPin />
                    <span>{isFr ? 'Carnet' : 'Journal'}</span>
                </>
            )}
        </span>
    )
}
