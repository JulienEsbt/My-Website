import {useTranslation} from 'react-i18next'
import './FeatureLoading.css'

interface FeatureLoadingProps {
    fill?: boolean
}

const FeatureLoading = ({fill = false}: FeatureLoadingProps) => {
    const {t} = useTranslation('common')
    return (
        <div
            className={`feature-loading ${fill ? 'fill' : ''}`}
            aria-busy="true"
            aria-live="polite"
        >
            <span className="feature-loading__indicator" aria-hidden="true" />
            <span className="sr-only">{t('loading.feature')}</span>
        </div>
    )
}

export default FeatureLoading
