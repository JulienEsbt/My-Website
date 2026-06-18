import React from 'react'
import {useTranslation} from 'react-i18next'
import {AiOutlineHome} from 'react-icons/ai'
import {BiCategoryAlt, BiBookOpen, BiUser} from 'react-icons/bi'
import SectionNav from '../../../components/common/navigation/sectionNav/SectionNav.jsx'

const ReflectionsNav = () => {
    const {t} = useTranslation('reflections')

    const items = [
        {id: 'top', label: t('nav.items.top'), icon: <AiOutlineHome/>},
        {id: 'themes', label: t('nav.items.themes'), icon: <BiCategoryAlt/>},
        {id: 'latest', label: t('nav.items.latest'), icon: <BiBookOpen/>},
        {id: 'author', label: t('nav.items.author'), icon: <BiUser/>},
    ]

    return <SectionNav items={items} ariaLabel={t('nav.aria')}/>
}

export default ReflectionsNav