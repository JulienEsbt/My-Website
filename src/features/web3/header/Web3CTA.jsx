import React from 'react'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import {motion} from 'framer-motion'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import {useTranslation} from 'react-i18next'
import {LINKS} from '../../../config/links.js'
import {FiArrowRight, FiGithub} from 'react-icons/fi'

const ExternalAction = ({href, children}) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{y: -2}}
        whileTap={{scale: 0.98}}
        className="btn btn-primary web3-cta__button"
    >
        {children}
    </motion.a>
)

const Web3CTA = () => {
    const {t} = useTranslation('web3')
    const mobile = useMediaQuery('(max-width: 700px)')
    if (mobile)
        return (
            <div className="cta web3-cta">
                <a className="btn btn-primary" href="#wallet-inspector">
                    {t('nav.items.wallet')}
                    <FiArrowRight aria-hidden="true" />
                </a>
                <a className="btn" href="#blockchain-explorer">
                    {t('nav.items.networks')}
                    <FiArrowRight aria-hidden="true" />
                </a>
            </div>
        )

    return (
        <div className="cta web3-cta" role="group" aria-label={t('cta.groupLabel')}>
            <ExternalAction href={LINKS.projects.megalis}>
                <FiGithub aria-hidden="true" />
                <span>{t('cta.megalis')}</span>
            </ExternalAction>

            <Link to="/#portfolio" className="btn web3-cta__button">
                <span>{t('cta.projects')}</span>
                <FiArrowRight aria-hidden="true" />
            </Link>
        </div>
    )
}

export default Web3CTA
