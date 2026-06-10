import React, {useEffect, useState} from 'react'
import './nav.css'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiLineChart} from 'react-icons/bi'
import {RiServiceLine} from 'react-icons/ri'
import {TbNetwork, TbWallet} from 'react-icons/tb'
import {MdOutlineEmail} from 'react-icons/md'
import {useTranslation} from 'react-i18next'

const SECTIONS = [
    {id: 'top', icon: <AiOutlineHome/>, key: 'home'},
    {id: 'about', icon: <AiOutlineUser/>, key: 'about'},
    {id: 'knowledge', icon: <BiBook/>, key: 'knowledge'},
    {id: 'blockchain-explorer', icon: <BiLineChart/>, key: 'networks'},
    {id: 'wallet-inspector', icon: <TbWallet/>, key: 'wallet'},
    {id: 'contact', icon: <MdOutlineEmail/>, key: 'contact'},
]

const Nav = () => {
    const {t} = useTranslation('web3')
    const [active, setActive] = useState('#top')

    useEffect(() => {
        const handleScroll = () => {
            const sections = SECTIONS
                .map(s => ({
                    id: s.id,
                    element: document.getElementById(s.id)
                }))
                .filter(s => s.element)

            const scrollPosition = window.scrollY + 250

            let current = '#top'

            sections.forEach(section => {
                if (scrollPosition >= section.element.offsetTop) {
                    current = `#${section.id}`
                }
            })

            setActive(current)
        }

        window.addEventListener('scroll', handleScroll)

        handleScroll()

        return () =>
            window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className="bnav" role="navigation" aria-label={t('nav.aria')}>
            {SECTIONS.map((section) => {
                const hash = `#${section.id}`
                const label = t(`nav.items.${section.key}`)

                return (
                    <a
                        key={section.id}
                        href={hash}
                        className={active === hash ? 'active' : ''}
                        aria-label={label}
                        data-label={label}
                        onClick={() => setActive(hash)}
                    >
                        {section.icon}
                    </a>
                )
            })}
        </nav>
    )
}

export default Nav