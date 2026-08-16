import {useCallback, useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {useTranslation} from 'react-i18next'
import useFocusTrap from '../../../components/common/accessibility/useFocusTrap.js'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'
import {getPreferredScrollBehavior} from '../../../components/common/accessibility/motionPreferences.js'
import FeatureLoading from '../../../components/common/feedback/featureLoading/FeatureLoading.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {loadTripPhotos} from '../../../data/travel/photoAlbums.js'

const TravelGallery = ({albumId, city, onOpenChange}) => {
    const {t} = useTranslation('travel')
    const [photos, setPhotos] = useState([])
    const [status, setStatus] = useState('loading')
    const [activePhotoIndex, setActivePhotoIndex] = useState(null)
    const lightboxStripRef = useRef(null)
    const lightboxRef = useRef(null)
    const lightboxCloseRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        setPhotos([])
        setStatus('loading')

        loadTripPhotos(albumId)
            .then((albumPhotos) => {
                if (cancelled) return
                setPhotos(albumPhotos)
                setStatus('ready')
            })
            .catch(() => {
                if (cancelled) return
                setStatus('error')
            })

        return () => {
            cancelled = true
        }
    }, [albumId])

    const openPhoto = (index) => {
        setActivePhotoIndex(index)
        onOpenChange(true)
    }

    const closePhoto = useCallback(() => {
        setActivePhotoIndex(null)
        onOpenChange(false)
    }, [onOpenChange])

    const previousPhoto = useCallback(() => {
        setActivePhotoIndex((index) => (index === 0 ? photos.length - 1 : index - 1))
    }, [photos.length])

    const nextPhoto = useCallback(() => {
        setActivePhotoIndex((index) => (index === photos.length - 1 ? 0 : index + 1))
    }, [photos.length])

    useFocusTrap({
        active: activePhotoIndex !== null,
        containerRef: lightboxRef,
        initialFocusRef: lightboxCloseRef,
        onDismiss: closePhoto,
    })

    useBodyScrollLock(activePhotoIndex !== null)

    useEffect(() => {
        if (activePhotoIndex === null) return undefined

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                previousPhoto()
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault()
                nextPhoto()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activePhotoIndex, nextPhoto, previousPhoto])

    useEffect(() => {
        if (activePhotoIndex === null) return undefined

        document.documentElement.classList.add('lightbox-open')
        document.body.classList.add('lightbox-open')

        const preventPageScroll = (event) => {
            if (lightboxStripRef.current?.contains(event.target)) return
            event.preventDefault()
        }

        window.addEventListener('wheel', preventPageScroll, {passive: false})
        window.addEventListener('touchmove', preventPageScroll, {passive: false})

        return () => {
            window.removeEventListener('wheel', preventPageScroll)
            window.removeEventListener('touchmove', preventPageScroll)
            document.documentElement.classList.remove('lightbox-open')
            document.body.classList.remove('lightbox-open')
        }
    }, [activePhotoIndex])

    useEffect(() => {
        if (activePhotoIndex === null) return

        lightboxStripRef.current?.children?.[activePhotoIndex]?.scrollIntoView({
            behavior: getPreferredScrollBehavior(),
            inline: 'center',
            block: 'nearest',
        })
    }, [activePhotoIndex])

    useEffect(() => {
        const isOpen = activePhotoIndex !== null
        const navigationElements = [
            document.querySelector('.lang-wrapper'),
            document.querySelector('.pagenav'),
            document.querySelector('.travel-nav'),
        ]

        navigationElements.forEach((element) => {
            if (element) element.style.display = isOpen ? 'none' : ''
        })

        return () => {
            navigationElements.forEach((element) => {
                if (element) element.style.display = ''
            })
        }
    }, [activePhotoIndex])

    if (status === 'loading') return <FeatureLoading />

    if (status === 'error') {
        return (
            <p className="travel-timeline__gallery-error" role="alert">
                {t('timeline.gallery.loadError')}
            </p>
        )
    }

    if (photos.length === 0) return null

    return (
        <>
            <div className="travel-timeline__photo-preview">
                <button
                    type="button"
                    className="travel-timeline__photo-hero"
                    onClick={() => openPhoto(0)}
                    aria-label={t('timeline.gallery.openPhoto', {number: 1})}
                >
                    <ResponsiveImage
                        media={photos[0].src}
                        alt=""
                        sizes="(max-width: 700px) 92vw, 520px"
                    />
                    <span>{t('timeline.gallery.viewPhotos')}</span>
                </button>

                <div className="travel-timeline__photo-strip">
                    {photos.slice(1, 4).map((photo, index) => (
                        <button
                            key={photo.src.id}
                            type="button"
                            className="travel-timeline__photo-thumb"
                            onClick={() => openPhoto(index + 1)}
                            aria-label={t('timeline.gallery.openPhoto', {number: index + 2})}
                        >
                            <ResponsiveImage media={photo.src} alt="" sizes="140px" />
                        </button>
                    ))}
                </div>

                {photos.length > 4 && (
                    <button
                        type="button"
                        className="travel-timeline__photo-more-wide"
                        onClick={() => openPhoto(Math.min(4, photos.length - 1))}
                    >
                        {t('timeline.gallery.openAll', {count: photos.length})}
                    </button>
                )}
            </div>

            {activePhotoIndex !== null &&
                createPortal(
                    <div
                        ref={lightboxRef}
                        className="travel-timeline__lightbox"
                        onClick={closePhoto}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="travel-gallery-title"
                        aria-describedby="travel-gallery-instructions"
                        tabIndex="-1"
                    >
                        <h2 id="travel-gallery-title" className="sr-only">
                            {t('timeline.gallery.title', {city})}
                        </h2>
                        <p id="travel-gallery-instructions" className="sr-only">
                            {t('timeline.gallery.instructions')}
                        </p>

                        <button
                            ref={lightboxCloseRef}
                            type="button"
                            className="travel-timeline__lightbox-close"
                            onClick={(event) => {
                                event.stopPropagation()
                                closePhoto()
                            }}
                            aria-label={t('timeline.gallery.close')}
                        >
                            ×
                        </button>

                        <button
                            type="button"
                            className="travel-timeline__lightbox-nav previous"
                            onClick={(event) => {
                                event.stopPropagation()
                                previousPhoto()
                            }}
                            aria-label={t('timeline.gallery.previous')}
                        >
                            ←
                        </button>

                        <div
                            className="travel-timeline__lightbox-content"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="travel-timeline__lightbox-image-frame">
                                <ResponsiveImage
                                    media={photos[activePhotoIndex].src}
                                    alt={t('timeline.gallery.photoAlt', {
                                        city,
                                        number: activePhotoIndex + 1,
                                        total: photos.length,
                                    })}
                                    sizes="100vw"
                                    loading="eager"
                                    fetchPriority="high"
                                />

                                <span
                                    className="travel-timeline__lightbox-counter"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {activePhotoIndex + 1} / {photos.length}
                                </span>
                            </div>

                            <div className="travel-timeline__lightbox-dock">
                                <div
                                    ref={lightboxStripRef}
                                    className="travel-timeline__lightbox-strip"
                                    onWheel={(event) => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                        event.currentTarget.scrollLeft += event.deltaY
                                    }}
                                >
                                    {photos.map((photo, index) => (
                                        <button
                                            key={`${photo.src.id}-lightbox-${index}`}
                                            type="button"
                                            className={activePhotoIndex === index ? 'active' : ''}
                                            onClick={() => setActivePhotoIndex(index)}
                                            aria-pressed={activePhotoIndex === index}
                                            aria-label={t('timeline.gallery.openPhoto', {
                                                number: index + 1,
                                            })}
                                        >
                                            <ResponsiveImage
                                                media={photo.src}
                                                alt=""
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="travel-timeline__lightbox-nav next"
                            onClick={(event) => {
                                event.stopPropagation()
                                nextPhoto()
                            }}
                            aria-label={t('timeline.gallery.next')}
                        >
                            →
                        </button>
                    </div>,
                    document.body
                )}
        </>
    )
}

export default TravelGallery
