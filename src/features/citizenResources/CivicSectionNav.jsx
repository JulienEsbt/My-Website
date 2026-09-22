import {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {FiCompass, FiBookOpen, FiGitBranch, FiSearch} from 'react-icons/fi'
import SectionNav from '../../components/common/navigation/sectionNav/SectionNav.jsx'

export default function CivicSectionNav() {
    const {t} = useTranslation('resources')
    const items = useMemo(
        () => [
            {id: 'approach', icon: <FiCompass />, label: t('nav.short.approach')},
            {id: 'selection', icon: <FiBookOpen />, label: t('nav.short.selection')},
            {id: 'projects', icon: <FiGitBranch />, label: t('nav.short.projects')},
            {id: 'further', icon: <FiSearch />, label: t('nav.short.further')},
        ],
        [t]
    )
    return <SectionNav items={items} ariaLabel={t('nav.label')} className="civic-section-nav" />
}
