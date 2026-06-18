import React, {useState} from 'react'
import {Spin as Hamburger} from 'hamburger-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher.jsx'
import {SITE_PAGES} from '../../../../config/pages.js'
import './PageNav.css'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)
    const {t} = useTranslation('common')

    const pages = [
        {to: '/', label: t('pageNav.home')},
        {to: '/web3', label: t('pageNav.web3')},
        {to: '/travel', label: t('pageNav.travel')},
        {to: '/reflections', label: t('pageNav.reflections')},
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
                            {SITE_PAGES.map((page) => (
                                <Link
                                    key={page.path}
                                    to={page.path}
                                    className="pagetext"
                                    onClick={closeMenu}
                                >
                                    {t(page.i18nKey)}
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