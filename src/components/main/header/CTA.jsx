import React from 'react'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {LINKS} from "../../../config/links.js";

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

const CTA = () => {
    const {t} = useTranslation('common')

    return (
        <div className="cta" role="group" aria-label="Primary actions">
            <Btn href={LINKS.files.cv} target="_blank" rel="noreferrer">
                {t('cta.open')}
            </Btn>
            <Btn href={LINKS.files.cv} download>
                {t('cta.download')}
            </Btn>
            <Btn href="#contact" className="btn btn-primary">
                {t('cta.talk')}
            </Btn>
        </div>
    )
}

export default CTA