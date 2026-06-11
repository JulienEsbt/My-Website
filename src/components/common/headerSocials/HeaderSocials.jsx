import React from 'react'
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import {LINKS} from '../../../config/links.js'
import './headerSocials.css'

const HeaderSocials = ({className = ''}) => {
    return (
        <nav className={`header-socials ${className}`} aria-label="Social links">
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
        </nav>
    )
}

export default HeaderSocials