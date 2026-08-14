import {useTranslation} from 'react-i18next'
import './SkipLink.css'

const SkipLink = () => {
    const {t} = useTranslation('common')

    return (
        <nav className="skip-link-nav" aria-label={t('accessibility.quickAccess')}>
            <a className="skip-link" href="#main">
                {t('accessibility.skipToContent')}
            </a>
        </nav>
    )
}

export default SkipLink
