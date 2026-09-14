import React, {useEffect, useRef, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {FiArrowLeft, FiArrowRight, FiMapPin, FiPause, FiPlay} from 'react-icons/fi'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {createMediaResolver} from '../../../config/media.js'
import trips from '../../../data/travel/trips.js'
import portugal from '../../../generated/media/travels/portugal-2025.json'
import guadeloupe from '../../../generated/media/travels/guadeloupe-2025.json'
import italy from '../../../generated/media/travels/italy-2023.json'
import austria from '../../../generated/media/travels/austria-2023.json'
import saintMartin from '../../../generated/media/travels/saint-martin-2023.json'
import estonia from '../../../generated/media/travels/estonia-2022.json'

const destinations = [
    ['portugal-2025', portugal, 'IMG_1949.jpeg', '50% 55%'],
    ['guadeloupe-2025', guadeloupe, 'IMG_1682.jpeg', '50% 66%'],
    ['italy-2023', italy, 'IMG_8723.jpeg', '50% 48%'],
    ['austria-2023', austria, 'IMG_2908.jpeg', '50% 52%'],
    ['saint-martin-2023', saintMartin, 'IMG_1808.jpeg', '50% 55%'],
    ['estonia-2022', estonia, 'IMG_2043.jpeg', '50% 55%'],
].map(([id, manifest, filename, photoPosition]) => ({
    ...trips.find((trip) => trip.id === id),
    photoPosition,
    photo: createMediaResolver(manifest, 'travels')(`${id}/${filename}`),
}))

export default function HomeTravelCarousel({language, readLabel}) {
    const fr = language === 'fr'
    const {state} = useLocation()
    const [index, setIndex] = useState(() =>
        Math.max(
            0,
            destinations.findIndex((trip) => trip.id === state?.homeTrip)
        )
    )
    const [paused, setPaused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [visible, setVisible] = useState(false)
    const root = useRef(null)
    const reducedMotion = useReducedMotion()
    const trip = destinations[index]
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.25,
        })
        observer.observe(root.current)
        return () => observer.disconnect()
    }, [])
    useEffect(() => {
        if (paused || hovered || !visible || reducedMotion) return undefined
        const timer = setInterval(() => {
            if (!document.hidden) setIndex((value) => (value + 1) % destinations.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [paused, hovered, visible, reducedMotion])
    const select = (value) => {
        setPaused(true)
        setIndex((value + destinations.length) % destinations.length)
    }
    return (
        <div
            ref={root}
            className="home-travel-carousel"
            role="region"
            aria-label={fr ? 'Récits de voyage sélectionnés' : 'Selected travel stories'}
        >
            <article
                className="home-discover__travel"
                key={trip.id}
                onFocusCapture={() => setPaused(true)}
            >
                <div className="home-discover__photo">
                    <ResponsiveImage
                        media={trip.photo}
                        style={{objectPosition: trip.photoPosition}}
                        alt={`${fr ? trip.country : trip.countryEn} · ${trip.year}`}
                        sizes="(max-width: 700px) 90vw, 55vw"
                    />
                    <span className="home-discover__location">
                        <FiMapPin aria-hidden="true" />
                        {fr ? trip.country : trip.countryEn}
                    </span>
                </div>
                <div className="home-discover__travel-copy">
                    <p className="home-discover__date">{fr ? trip.dateLabel : trip.dateLabelEn}</p>
                    <h3>{fr ? trip.city : trip.cityEn}</h3>
                    <p>{fr ? trip.description : trip.descriptionEn}</p>
                    <Link
                        className="btn home-discover__story-link"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        to={`/travel/${trip.id}`}
                        state={{fromHome: 'travel'}}
                    >
                        {readLabel} <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </article>
            <div className="home-travel-carousel__controls">
                <div className="home-travel-carousel__destinations">
                    {destinations.map((entry, i) => (
                        <button
                            key={entry.id}
                            type="button"
                            aria-pressed={i === index}
                            onClick={() => select(i)}
                        >
                            <span aria-hidden="true">0{i + 1}</span>{' '}
                            {fr ? entry.country : entry.countryEn}
                        </button>
                    ))}
                </div>
                <div className="home-travel-carousel__arrows">
                    <button
                        type="button"
                        onClick={() => select(index - 1)}
                        aria-label={fr ? 'Voyage précédent' : 'Previous trip'}
                    >
                        <FiArrowLeft />
                    </button>
                    {!reducedMotion && (
                        <button
                            type="button"
                            onClick={() => setPaused((value) => !value)}
                            aria-label={
                                paused
                                    ? fr
                                        ? 'Reprendre le défilement des voyages'
                                        : 'Resume travel slideshow'
                                    : fr
                                      ? 'Mettre les voyages en pause'
                                      : 'Pause travel slideshow'
                            }
                        >
                            {paused ? <FiPlay /> : <FiPause />}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => select(index + 1)}
                        aria-label={fr ? 'Voyage suivant' : 'Next trip'}
                    >
                        <FiArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}
