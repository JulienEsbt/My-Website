import React from 'react'
import {BsGithub, BsLinkedin} from 'react-icons/bs'

const HeaderSocials = () => {
    return (
        <nav className="header__socials" aria-label="Social links">
            <a href="https://www.linkedin.com/in/julien-esterbet/" target="_blank" rel="noreferrer"
               aria-label="LinkedIn">
                <BsLinkedin/>
            </a>
            <a href="https://github.com/JulienEsbt" target="_blank" rel="noreferrer" aria-label="GitHub">
                <BsGithub/>
            </a>
        </nav>
    )
}

export default HeaderSocials