import React, {useState} from 'react'
import {Spin as Hamburger} from 'hamburger-react'
import {Link} from 'react-router-dom'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher.jsx'
import './PageNav.css'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            {/* 🔹 Bouton Langue toujours visible en haut à droite */}
            <div className="lang-wrapper">
                <LanguageSwitcher/>
            </div>

            {/* 🔹 Menu hamburger + navigation */}
            <div className="pagenav">
                <div className="pagenavbar">
                    <div className="navbutton">
                        <Hamburger toggled={isOpen} toggle={setOpen}/>
                    </div>

                    {isOpen && (
                        <div className="pagebar">
                            <Link to="/" className="pagetext">Home</Link>
                            <Link to="/crypto" className="pagetext">Crypto</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PageNav