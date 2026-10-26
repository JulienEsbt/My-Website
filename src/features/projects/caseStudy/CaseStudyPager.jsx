import {FiArrowLeft, FiArrowRight} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import {ROUTE_PATHS} from '../../../config/routes.js'

const STUDIES = [
    {id: '1', path: ROUTE_PATHS.brunoPizzaCaseStudy},
    {id: '4', path: ROUTE_PATHS.openDenteCaseStudy},
    {id: '2', path: ROUTE_PATHS.myWebsiteCaseStudy},
]

export default function CaseStudyPager({current}) {
    const {t} = useTranslation('projects')
    const index = STUDIES.findIndex(({id}) => id === current)
    if (index < 0) return null
    return (
        <nav className="case-study__pager" aria-label={t('actions.browse')}>
            {[-1, 1].map((direction) => {
                const project = STUDIES[(index + direction + STUDIES.length) % STUDIES.length]
                const previous = direction < 0
                const Icon = previous ? FiArrowLeft : FiArrowRight
                return (
                    <Link key={direction} to={project.path} rel={previous ? 'prev' : 'next'}>
                        <Icon aria-hidden="true" />
                        <span>
                            <small>{t(`actions.${previous ? 'previous' : 'next'}`)}</small>
                            <strong>{t(`actions.projects.${project.id}`)}</strong>
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}
