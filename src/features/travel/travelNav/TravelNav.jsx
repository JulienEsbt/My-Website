import React from 'react'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import {useTranslation} from 'react-i18next'
import {AiOutlineHome} from 'react-icons/ai'
import {BiMapAlt, BiTimeFive} from 'react-icons/bi'
import {PiCompassBold} from 'react-icons/pi'
import SectionNav from '../../../components/common/navigation/sectionNav/SectionNav.jsx'

const TravelNav = () => {
    const {t} = useTranslation('travel')
    const mobile = useMediaQuery('(max-width: 700px)')

    const items = [
        {id: 'top', label: t('nav.items.top'), icon: <AiOutlineHome />},
        {
            id: mobile ? 'mobile-travel-map' : 'travel-explorer',
            label: t('nav.items.explorer'),
            icon: <BiMapAlt />,
        },
        {id: 'stories', label: t('nav.items.timeline'), icon: <BiTimeFive />},
        {id: 'dreams', label: t('nav.items.dreams'), icon: <PiCompassBold />},
    ]

    return (
        <div className="travel-nav">
            <SectionNav
                items={mobile ? [items[0], items[2], items[1], items[3]] : items}
                ariaLabel={t('nav.aria')}
            />
        </div>
    )
}

export default TravelNav
