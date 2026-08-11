import React from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
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
