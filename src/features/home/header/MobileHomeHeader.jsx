import {useTranslation} from 'react-i18next'
import {FiArrowDown, FiArrowUpRight, FiCompass} from 'react-icons/fi'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import HeaderSocials from '../../../components/common/social/headerSocials/HeaderSocials.jsx'
import {HOME_ASSETS} from '../../../config/homeAssets.js'

export default function MobileHomeHeader() {
    const {t, i18n} = useTranslation('home')
    const fr = i18n.resolvedLanguage?.startsWith('fr')
    return (
        <header id="top" className="mobile-home-entry container">
            <div className="mobile-home-entry__identity">
                <div>
                    <p className="section-kicker">{t('header.eyebrow')}</p>
                    <h1>
                        Julien <span>Esterbet</span>
                    </h1>
                </div>
                <ResponsiveImage
                    media={HOME_ASSETS.header.me}
                    alt={t('header.portraitAlt')}
                    sizes="128px"
                    loading="eager"
                    fetchPriority="high"
                />
            </div>
            <p className="mobile-home-entry__subtitle">{t('header.subtitle')}</p>
            <p className="mobile-home-entry__description">{t('header.description')}</p>
            <div className="mobile-home-entry__actions">
                <a className="btn btn-primary" href="#portfolio">
                    {fr ? 'Voir mes projets' : 'Explore my projects'}
                    <FiArrowDown aria-hidden="true" />
                </a>
                <a className="btn" href="#contact">
                    {t('cta.contact')}
                    <FiArrowUpRight aria-hidden="true" />
                </a>
            </div>
            <div className="mobile-home-entry__links">
                <HeaderSocials />
                <Link to="/resume">
                    {t('cta.cv')}
                    <FiArrowUpRight aria-hidden="true" />
                </Link>
            </div>
            <Link className="mobile-home-entry__discover" to="/travel">
                <FiCompass aria-hidden="true" />
                <span>
                    {fr ? 'Au-delà du code' : 'Beyond code'}
                    <strong>{fr ? 'Carnets de voyage' : 'Travel journals'}</strong>
                </span>
                <FiArrowUpRight aria-hidden="true" />
            </Link>
        </header>
    )
}
