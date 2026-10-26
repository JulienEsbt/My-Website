import {FiFileText, FiGrid, FiArrowRight, FiMonitor, FiLayout} from 'react-icons/fi'
import {BsGithub} from 'react-icons/bs'
import {SiVercel, SiCloudflare} from 'react-icons/si'
import {useTranslation} from 'react-i18next'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {BRUNO_GALLERY} from '../../../config/brunoGallery.js'

export function BrunoHeroVisual() {
    const {t} = useTranslation('projects')
    const image = BRUNO_GALLERY[7]
    return (
        <figure className="bruno-hero-visual">
            <div className="bruno-hero-visual__flow" aria-label={t('bruno.hero.flowLabel')}>
                <span>
                    <FiFileText aria-hidden="true" />
                    Excel
                </span>
                <FiArrowRight aria-hidden="true" />
                <span>
                    <FiGrid aria-hidden="true" />
                    {t('bruno.hero.quantities')}
                </span>
                <FiArrowRight aria-hidden="true" />
                <span>
                    <FiMonitor aria-hidden="true" />
                    {t('bruno.hero.workshop')}
                </span>
            </div>
            <ResponsiveImage
                media={image}
                alt={t(`bruno.gallery.captions.${image.id}`)}
                sizes="(min-width: 2000px) 800px, (min-width: 768px) 40vw, 90vw"
                loading="eager"
                fetchPriority="high"
            />
            <figcaption>{t('bruno.hero.visualCaption')}</figcaption>
        </figure>
    )
}

export function WebsiteHeroVisual() {
    const {t} = useTranslation('projects')
    return (
        <figure className="website-delivery" aria-label={t('website.hero.diagramLabel')}>
            <svg viewBox="0 0 600 440" aria-hidden="true" focusable="false">
                <path d="M300 180V226M100 290V250Q100 226 124 226H476Q500 226 500 250V290M300 226V290" />
                <circle cx="300" cy="226" r="5" />
            </svg>
            <div className="website-delivery__app">
                <FiLayout aria-hidden="true" />
                <strong>React + Vite</strong>
                <span>{t('website.hero.appLabel')}</span>
            </div>
            <div className="website-delivery__services">
                {[
                    [BsGithub, 'GitHub', 'code'],
                    [SiVercel, 'Vercel', 'hosting'],
                    [SiCloudflare, 'Cloudflare R2', 'media'],
                ].map(([Icon, name, label]) => (
                    <div key={name}>
                        <Icon aria-hidden="true" />
                        <strong>{name}</strong>
                        <span>{t(`website.hero.services.${label}`)}</span>
                    </div>
                ))}
            </div>
            <figcaption>{t('website.hero.visualCaption')}</figcaption>
        </figure>
    )
}
