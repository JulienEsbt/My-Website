import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {LINKS} from "../../../../config/links.js";
import {BsYoutube} from 'react-icons/bs'
import {FaTwitter, FaInstagram, FaTiktok} from 'react-icons/fa'

const IconBtn = ({href, label, children, className = 'icon', ...props}) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        whileHover={{y: -2}}
        whileTap={{scale: 0.95}}
        className={className}
        aria-label={label}
        {...props}
    >
        {children}
    </motion.a>
)

const SocialsCTA = () => {
    const {t} = useTranslation('web3')

    return (
        <div className="cta" role="group" aria-label={t('cta.groupLabel')}>
            <IconBtn
                href={LINKS.social.twitter}
                label={t('cta.twitter')}
                className="icon icon-primary"
            >
                <FaTwitter/>
            </IconBtn>

            <IconBtn
                href={LINKS.social.youtube}
                label={t('cta.youtube')}
                className="icon"
            >
                <BsYoutube/>
            </IconBtn>

            <IconBtn
                href={LINKS.social.tiktok}
                label={t('cta.tiktok')}
                className="icon icon-primary"
            >
                <FaTiktok/>
            </IconBtn>

            <IconBtn
                href={LINKS.social.instagram}
                label={t('cta.instagram')}
                className="icon"
            >
                <FaInstagram/>
            </IconBtn>
        </div>
    )
}

export default SocialsCTA