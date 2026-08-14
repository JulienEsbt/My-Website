import React from 'react'
import {useTranslation} from 'react-i18next'
import {BsGithub, BsLinkedin} from 'react-icons/bs'
import {LINKS} from '../../../../config/links.js'
import './HeaderSocials.css'

const HeaderSocials = ({className = ''}) => {
    const {t} = useTranslation('common')

    return (
        <nav
            className={`header-socials ${className}`}
            aria-label={t('accessibility.socialNavigation')}
        >
            <a href={LINKS.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <BsLinkedin />
            </a>

            <a href={LINKS.social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <BsGithub />
            </a>
        </nav>
    )
}

export default HeaderSocials
