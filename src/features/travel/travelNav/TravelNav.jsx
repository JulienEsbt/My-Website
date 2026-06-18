import React from 'react'
import {useTranslation} from 'react-i18next'
import {AiOutlineHome} from 'react-icons/ai'
import {BiMapAlt, BiTimeFive} from 'react-icons/bi'
import {PiCompassBold} from 'react-icons/pi'
import SectionNav from '../../../components/common/navigation/sectionNav/SectionNav.jsx'

const TravelNav = () => {
    const {t} = useTranslation('travel')

    const items = [
        {id: 'top', label: t('nav.items.top'), icon: <AiOutlineHome/>},
        {id: 'travel-explorer', label: t('nav.items.explorer'), icon: <BiMapAlt/>},
        {id: 'stories', label: t('nav.items.timeline'), icon: <BiTimeFive/>},
        {id: 'dreams', label: t('nav.items.dreams'), icon: <PiCompassBold/>},
    ]

    return <SectionNav items={items} ariaLabel={t('nav.aria')}/>
}

export default TravelNav