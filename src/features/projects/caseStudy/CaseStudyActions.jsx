import {useTranslation} from 'react-i18next'
import {BsGithub} from 'react-icons/bs'
import {FiArrowLeft} from 'react-icons/fi'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'

export default function CaseStudyActions({repository, children}) {
    const {t} = useTranslation('projects')
    return (
        <nav className="case-study__actions" aria-label={t('actions.label')}>
            <Link className="btn case-study__button" to="/#portfolio">
                <FiArrowLeft aria-hidden="true" />
                {t('actions.back')}
            </Link>
            {children}
            <a
                className="btn btn-primary case-study__button"
                href={repository}
                target="_blank"
                rel="noreferrer"
            >
                <BsGithub aria-hidden="true" />
                {t('actions.code')}
            </a>
        </nav>
    )
}
