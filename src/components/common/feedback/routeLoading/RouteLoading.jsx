import {useTranslation} from 'react-i18next'
import './RouteLoading.css'

const RouteLoading = () => {
    const {t} = useTranslation('common')

    return (
        <main className="route-loading" aria-busy="true" aria-live="polite">
            <span className="route-loading__indicator" aria-hidden="true" />
            <span className="sr-only">{t('loading.route')}</span>
        </main>
    )
}

export default RouteLoading
