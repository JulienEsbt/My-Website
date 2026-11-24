import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FiArrowUpRight, FiChevronLeft, FiChevronRight} from 'react-icons/fi'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'

export default function ProjectGallery({screens, project}) {
    const {t, i18n} = useTranslation('projects')
    const [index, setIndex] = useState(0)
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'
    const screen = screens[index]
    const media = screen.media ?? screen[language]
    const select = (next) => setIndex((next + screens.length) % screens.length)

    return (
        <section
            id="explore"
            className="container case-study__section opendente-gallery"
            aria-labelledby="opendente-gallery-title"
        >
            <p className="section-kicker">{t(`${project}.gallery.kicker`)}</p>
            <h2 id="opendente-gallery-title">{t(`${project}.gallery.title`)}</h2>
            <div className="opendente-gallery__layout">
                <div className="opendente-gallery__copy">
                    <div
                        className="opendente-gallery__choices"
                        role="group"
                        aria-label={t(`${project}.gallery.choose`)}
                    >
                        {screens.map(({id}, itemIndex) => (
                            <button
                                type="button"
                                key={id}
                                aria-pressed={index === itemIndex}
                                onClick={() => select(itemIndex)}
                            >
                                <span aria-hidden="true">0{itemIndex + 1}</span>
                                {t(`${project}.gallery.items.${id}.label`)}
                                <FiArrowUpRight aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                    <div
                        className="opendente-gallery__description"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <h3>{t(`${project}.gallery.items.${screen.id}.title`)}</h3>
                        <p>{t(`${project}.gallery.items.${screen.id}.body`)}</p>
                    </div>
                    <p className="opendente-gallery__note">{t(`${project}.gallery.note`)}</p>
                </div>
                <figure className="opendente-gallery__figure">
                    <div className="opendente-gallery__screen">
                        <ResponsiveImage
                            media={media}
                            alt={t(`${project}.gallery.items.${screen.id}.alt`)}
                            sizes="(min-width: 1100px) 520px, (min-width: 768px) 48vw, 92vw"
                        />
                    </div>
                    <figcaption className="opendente-gallery__toolbar">
                        <span aria-live="polite">
                            0{index + 1} / 0{screens.length}
                        </span>
                        <div>
                            <button
                                type="button"
                                onClick={() => select(index - 1)}
                                aria-label={t(`${project}.gallery.previous`)}
                            >
                                <FiChevronLeft aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => select(index + 1)}
                                aria-label={t(`${project}.gallery.next`)}
                            >
                                <FiChevronRight aria-hidden="true" />
                            </button>
                            <a
                                href={media.variants.at(-1).url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={t(`${project}.gallery.enlarge`)}
                                title={t(`${project}.gallery.enlarge`)}
                            >
                                <FiArrowUpRight aria-hidden="true" />
                            </a>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}
