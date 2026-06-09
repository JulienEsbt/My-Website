import React, {useState} from 'react'
import {Spin as Hamburger} from 'hamburger-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher.jsx'
import './PageNav.css'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)
    const {t} = useTranslation('common')

    const pages = [
        {to: '/', label: t('pageNav.home')},
        {to: '/crypto', label: t('pageNav.web3')},
        {to: '/travel', label: t('pageNav.travel')},
        {to: '/reflexions', label: t('pageNav.reflexions')},
    ]

    const closeMenu = () => setOpen(false)

    return (
        <>
            <div className="lang-wrapper">
                <LanguageSwitcher/>
            </div>

            <div className="pagenav">
                <div className="pagenavbar">
                    <div className="navbutton">
                        <Hamburger toggled={isOpen} toggle={setOpen}/>
                    </div>

                    {isOpen && (
                        <div className="pagebar">
                            {pages.map((page) => (
                                <Link
                                    key={page.to}
                                    to={page.to}
                                    className="pagetext"
                                    onClick={closeMenu}
                                >
                                    {page.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PageNav