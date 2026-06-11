import React from 'react'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiLineChart} from 'react-icons/bi'
import {TbWallet} from 'react-icons/tb'
import {MdOutlineEmail} from 'react-icons/md'
import {useTranslation} from 'react-i18next'
import SectionNav from '../../../common/sectionNav/SectionNav.jsx'

const Web3Nav = () => {
    const {t} = useTranslation('web3')

    const items = [
        {id: 'top', icon: <AiOutlineHome/>, label: t('nav.items.home')},
        {id: 'about', icon: <AiOutlineUser/>, label: t('nav.items.about')},
        {id: 'knowledge', icon: <BiBook/>, label: t('nav.items.knowledge')},
        {id: 'blockchain-explorer', icon: <BiLineChart/>, label: t('nav.items.networks')},
        {id: 'wallet-inspector', icon: <TbWallet/>, label: t('nav.items.wallet')},
        {id: 'contact', icon: <MdOutlineEmail/>, label: t('nav.items.contact')},
    ]

    return <SectionNav items={items} ariaLabel={t('nav.aria')}/>
}

export default Web3Nav