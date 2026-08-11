import {useTranslation} from 'react-i18next'
import './SkipLink.css'

const SkipLink = () => {
    const {t} = useTranslation('common')

    return (
        <a className="skip-link" href="#main">
            {t('accessibility.skipToContent')}
        </a>
    )
}

export default SkipLink
