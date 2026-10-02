import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiMaximize2} from 'react-icons/fi'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import {BRUNO_GALLERY} from '../../../config/brunoGallery.js'
import './BrunoGallery.css'

export default function BrunoGallery() {
    const {t} = useTranslation('projects')
    const reduced = useReducedMotion()
    const [index, setIndex] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [visible, setVisible] = useState(false)
    const [pageVisible, setPageVisible] = useState(true)
    const root = useRef(null)
    const touchStart = useRef(null)
    const active = playing && !reduced && !hovered && !focused && visible && pageVisible
    const image = BRUNO_GALLERY[index]
    const caption = t(`bruno.gallery.captions.${image.id}`)
    const select = (next) => {
        setPlaying(false)
        setIndex((next + BRUNO_GALLERY.length) % BRUNO_GALLERY.length)
    }
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.15,
        })
        observer.observe(root.current)
        const visibility = () => setPageVisible(!document.hidden)
        visibility()
        document.addEventListener('visibilitychange', visibility)
        return () => {
            observer.disconnect()
            document.removeEventListener('visibilitychange', visibility)
        }
    }, [])
    useEffect(() => {
        if (!active) return
        const timer = setInterval(
            () => setIndex((current) => (current + 1) % BRUNO_GALLERY.length),
            6500
        )
        return () => clearInterval(timer)
    }, [active])
    return (
        <section
            ref={root}
            className="bruno-gallery"
            aria-label={t('bruno.gallery.title')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
            }}
        >
            <div
                className="bruno-gallery__screen"
                onTouchStart={(event) => {
                    touchStart.current = event.touches[0]
                }}
                onTouchEnd={(event) => {
                    const start = touchStart.current
                    const end = event.changedTouches[0]
                    if (
                        start &&
                        Math.abs(end.clientX - start.clientX) > 50 &&
                        Math.abs(end.clientX - start.clientX) >
                            Math.abs(end.clientY - start.clientY)
                    )
                        select(index + (end.clientX < start.clientX ? 1 : -1))
                    touchStart.current = null
                }}
            >
                <ResponsiveImage
                    key={image.id}
                    media={image}
                    alt={caption}
                    sizes="(min-width: 1600px) 1440px, 92vw"
                    loading="eager"
                    fetchPriority={index === 0 ? 'high' : undefined}
                />
            </div>
            <div className="bruno-gallery__toolbar">
                <div className="bruno-gallery__caption" aria-live={active ? 'off' : 'polite'}>
                    <span>{String(index + 1).padStart(2, '0')} / 10</span>
                    <strong>{caption}</strong>
                </div>
                <div className="bruno-gallery__controls">
                    <button
                        type="button"
                        onClick={() => select(index - 1)}
                        aria-label={t('bruno.gallery.previous')}
                    >
                        <FiChevronLeft />
                    </button>
                    {!reduced && (
                        <button
                            type="button"
                            onClick={() => setPlaying(!playing)}
                            aria-label={t(`bruno.gallery.${playing ? 'pause' : 'play'}`)}
                        >
                            {playing ? <FiPause /> : <FiPlay />}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => select(index + 1)}
                        aria-label={t('bruno.gallery.next')}
                    >
                        <FiChevronRight />
                    </button>
                    <a
                        href={image.variants.at(-1).url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('bruno.gallery.enlarge')}
                        title={t('bruno.gallery.enlarge')}
                    >
                        <FiMaximize2 />
                    </a>
                </div>
            </div>
            <div className="bruno-gallery__thumbnails" aria-label={t('bruno.gallery.choose')}>
                {BRUNO_GALLERY.map((item, i) => (
                    <button
                        type="button"
                        key={item.id}
                        aria-pressed={index === i}
                        onClick={() => select(i)}
                        aria-label={t(`bruno.gallery.captions.${item.id}`)}
                    >
                        <img
                            src={item.variants[0].url}
                            alt=""
                            width="128"
                            height="80"
                            loading="lazy"
                        />
                        <span>{String(i + 1).padStart(2, '0')}</span>
                    </button>
                ))}
            </div>
        </section>
    )
}
