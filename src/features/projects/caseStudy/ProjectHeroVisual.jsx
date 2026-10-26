import {FiFileText, FiCheckCircle, FiLayers, FiLayout} from 'react-icons/fi'
import {BsGithub} from 'react-icons/bs'
import {SiVercel, SiCloudflare} from 'react-icons/si'
import {useTranslation} from 'react-i18next'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import {BRUNO_HERO} from '../../../config/brunoHero.js'

export function BrunoHeroVisual() {
    const {t} = useTranslation('projects')
    return (
        <figure className="bruno-hero-visual" aria-label={t('bruno.hero.flowLabel')}>
            <div className="bruno-hero-visual__orbit" aria-hidden="true" />
            <svg
                className="bruno-hero-visual__path"
                viewBox="0 0 520 460"
                aria-hidden="true"
                focusable="false"
            >
                <path d="M100 110C290 0 500 60 440 220S250 450 110 330" />
            </svg>
            <div className="bruno-hero-visual__base">
                <ResponsiveImage
                    media={BRUNO_HERO.base}
                    alt=""
                    sizes="(min-width: 1600px) 280px, 45vw"
                    loading="eager"
                />
            </div>
            <div className="bruno-hero-visual__sheet">
                <span className="bruno-hero-visual__file">
                    <FiFileText aria-hidden="true" /> Excel <small>.xlsx</small>
                </span>
                <strong>{t('bruno.hero.planLabel')}</strong>
                <div className="bruno-hero-visual__grid" aria-hidden="true">
                    {Array.from({length: 15}, (_, index) => (
                        <span key={index} />
                    ))}
                </div>
                <span className="bruno-hero-visual__checked">
                    <FiCheckCircle aria-hidden="true" />
                    {t('bruno.hero.checkedLabel')}
                </span>
            </div>
            <div className="bruno-hero-visual__pizza">
                <ResponsiveImage
                    media={BRUNO_HERO.assembly}
                    alt={t('bruno.hero.assemblyAlt')}
                    sizes="(min-width: 1600px) 360px, (max-width: 700px) 65vw, 30vw"
                    loading="eager"
                    fetchPriority="high"
                />
            </div>
            <span className="bruno-hero-visual__badge">
                <FiLayers aria-hidden="true" />
                {t('bruno.hero.assemblyLabel')}
            </span>
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
