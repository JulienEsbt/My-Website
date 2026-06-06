import React, {useState} from 'react'
import {Spin as Hamburger} from 'hamburger-react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher.jsx'
import './PageNav.css'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)
    const {t} = useTranslation('common')

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
                            <Link to="/" className="pagetext" onClick={closeMenu}>
                                {t('pageNav.home')}
                            </Link>
                            <Link to="/crypto" className="pagetext" onClick={closeMenu}>
                                {t('pageNav.crypto')}
                            </Link>
                            <Link to="/travel" className="pagetext" onClick={closeMenu}>
                                {t('pageNav.travel')}
                            </Link>
                            <Link to="/reflexions" className="pagetext" onClick={closeMenu}>
                                {t('pageNav.reflexions')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PageNav