import React from 'react'
import {Link} from '../../../components/common/navigation/LocalizedLink.jsx'
import {useTranslation} from 'react-i18next'

const HeaderCTA = () => {
    const {t} = useTranslation('home')

    return (
        <div className="cta" role="group" aria-label={t('cta.aria')}>
            <a className="btn" href="#contact">
                {t('cta.contact')}
            </a>

            <Link className="btn" to="/web3">
                {t('cta.web3')}
            </Link>

            <Link to="/resume" className="btn btn-primary">
                {t('cta.cv')}
            </Link>
        </div>
    )
}

export default HeaderCTA
