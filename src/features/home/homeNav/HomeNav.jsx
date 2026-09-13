import React from 'react'
import {useTranslation} from 'react-i18next'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBookOpen, BiMessageSquareDetail} from 'react-icons/bi'
import {VscFolderLibrary} from 'react-icons/vsc'
import {PiCompassBold} from 'react-icons/pi'
import SectionNav from '../../../components/common/navigation/sectionNav/SectionNav.jsx'

const HomeNav = () => {
    const {t} = useTranslation('home')

    const items = [
        {id: 'top', label: t('nav.items.home'), icon: <AiOutlineHome />},
        {id: 'about', label: t('nav.items.about'), icon: <AiOutlineUser />},
        {id: 'portfolio', label: t('nav.items.portfolio'), icon: <VscFolderLibrary />},
        {id: 'home-reflections', label: t('nav.items.reflections'), icon: <BiBookOpen />},
        {id: 'home-travel', label: t('nav.items.travel'), icon: <PiCompassBold />},
        {id: 'contact', label: t('nav.items.contact'), icon: <BiMessageSquareDetail />},
    ]

    return (
        <SectionNav
            avoidSelector=".home-hero .cta"
            items={items}
            ariaLabel={t('nav.aria', 'Section navigation')}
        />
    )
}

export default HomeNav
