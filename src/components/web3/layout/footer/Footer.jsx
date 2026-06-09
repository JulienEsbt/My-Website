import React from 'react'
import './footer.css'
import {FaTwitter, FaInstagram, FaTiktok} from 'react-icons/fa'
import {BsYoutube, BsLinkedin, BsGithub} from 'react-icons/bs'
import {useTranslation} from 'react-i18next'
import {LINKS} from '../../../../config/links.js'
import {SITE_PAGES} from '../../../../config/pages.js'

const Footer = () => {
    const {t} = useTranslation('crypto')
    const {t: tCommon} = useTranslation('common')

    const sectionLinks = [
        ['#top', t('footer.links.home')],
        ['#about', t('footer.links.about')],
        ['#knowledge', t('footer.links.knowledge')],
        ['#on-chain-dashboard', t('footer.links.networks')],
        ['#wallet-inspector', t('footer.links.wallet')],
        ['#donation', t('footer.links.donation')],
        ['#tools', t('footer.links.tools')],
        ['#contact', t('footer.links.contact')],
    ]

    const pageLinks = SITE_PAGES.map((page) => [
        page.path,
        tCommon(page.i18nKey),
    ])

    const socials = [
        ['Twitter', LINKS.social.twitter, <FaTwitter/>],
        ['YouTube', LINKS.social.youtube, <BsYoutube/>],
        ['TikTok', LINKS.social.tiktok, <FaTiktok/>],
        ['Instagram', LINKS.social.instagram, <FaInstagram/>],
        ['LinkedIn', LINKS.social.linkedin, <BsLinkedin/>],
        ['GitHub', LINKS.social.github, <BsGithub/>],
    ]

    return (
        <div className="crypto-footer">
            <div className="container crypto-footer__card">
                <div className="crypto-footer__topline"/>

                <h2 className="crypto-footer__name">Julien ESTERBET</h2>
                <p className="crypto-footer__tagline">Web3 • Crypto • DeFi • Blockchain</p>

                <div className="crypto-footer__groups">
                    <div>
                        <span className="crypto-footer__label">{t('footer.sections')}</span>
                        <div className="crypto-footer__links">
                            {sectionLinks.map(([href, label]) => (
                                <a key={href} href={href}>{label}</a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="crypto-footer__label">{t('footer.pages')}</span>
                        <div className="crypto-footer__links">
                            {pageLinks.map(([href, label]) => (
                                <a key={href} href={href}>{label}</a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="crypto-footer__socials">
                    {socials.map(([label, href, icon]) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                        >
                            {icon}
                        </a>
                    ))}
                </div>

                <small className="crypto-footer__copyright">
                    {t('footer.copyright')}
                </small>
            </div>
        </div>
    )
}

export default Footer