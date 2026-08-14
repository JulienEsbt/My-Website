import React from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

const Btn = ({href, children, className = 'btn', ...props}) => (
    <motion.a
        href={href}
        whileHover={{y: -2}}
        whileTap={{scale: 0.98}}
        className={className}
        {...props}
    >
        {children}
    </motion.a>
)

const RouteBtn = ({to, children, className = 'btn'}) => (
    <Link to={to} className={className}>
        {children}
    </Link>
)

const HeaderCTA = () => {
    const {t} = useTranslation('home')

    return (
        <div className="cta" role="group" aria-label={t('cta.aria')}>
            <Btn href="#contact" className="btn btn-primary">
                {t('cta.contact')}
            </Btn>

            <RouteBtn to="/web3">{t('cta.web3')}</RouteBtn>

            <RouteBtn to="/resume">{t('cta.cv')}</RouteBtn>
        </div>
    )
}

export default HeaderCTA
