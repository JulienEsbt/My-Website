import {useTranslation} from 'react-i18next'
import {FiArrowUpRight, FiCompass} from 'react-icons/fi'
import {Link} from '../../components/common/navigation/LocalizedLink.jsx'
import './CitizenResourcesLink.css'

export default function CitizenResourcesLink({copy}) {
    const {t} = useTranslation('common')
    return (
        <aside className="citizen-resources-link" aria-label={t('pageNav.resources')}>
            <FiCompass aria-hidden="true" className="citizen-resources-link__icon" />
            <div>
                <h3>{copy.title}</h3>
                <p>{copy.body}</p>
            </div>
            <Link to="/resources">
                {copy.cta}
                <FiArrowUpRight aria-hidden="true" />
            </Link>
        </aside>
    )
}
