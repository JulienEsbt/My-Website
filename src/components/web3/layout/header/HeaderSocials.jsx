import React from 'react'
import {BsLinkedin, BsGithub} from 'react-icons/bs'
import {LINKS} from "../../../../config/links.js";

const HeaderSocials = () => {
    return (
        <nav className="header__socials" aria-label="Crypto social links">
            <a
                href={LINKS.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
            >
                <BsLinkedin/>
            </a>

            <a
                href={LINKS.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
            >
                <BsGithub/>
            </a>

            <span className="decor-line" aria-hidden/>
        </nav>
    )
}

export default HeaderSocials