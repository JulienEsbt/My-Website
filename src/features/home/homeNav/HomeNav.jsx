import React from 'react'
import {useTranslation} from 'react-i18next'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiCodeAlt, BiMessageSquareDetail} from 'react-icons/bi'
import {VscFolderLibrary} from 'react-icons/vsc'
import {PiCompassBold} from 'react-icons/pi'
import SectionNav from '../../../components/common/navigation/sectionNav/SectionNav.jsx'

const HomeNav = () => {
    const {t} = useTranslation('home')

    const items = [
        {id: 'top', label: t('nav.items.home'), icon: <AiOutlineHome />},
        {id: 'about', label: t('nav.items.about'), icon: <AiOutlineUser />},
        {id: 'experience', label: t('nav.items.experience'), icon: <BiCodeAlt />},
        {id: 'portfolio', label: t('nav.items.portfolio'), icon: <VscFolderLibrary />},
        {id: 'goals', label: t('nav.items.goals'), icon: <PiCompassBold />},
        {id: 'contact', label: t('nav.items.contact'), icon: <BiMessageSquareDetail />},
    ]

    return <SectionNav items={items} ariaLabel={t('nav.aria', 'Section navigation')} />
}

export default HomeNav
