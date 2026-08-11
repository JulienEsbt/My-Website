import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import PageNav from '../components/common/navigation/pageNav/PageNav.jsx'
import Footer from '../components/common/layout/footerSection/Footer.jsx'
import './NotFoundPage.css'

const NotFoundPage = ({context = 'page'}) => {
    const {t} = useTranslation('common')
    const descriptionKey = context === 'reflection' ? 'notFound.reflection' : 'notFound.description'

    return (
        <main id="main" tabIndex="-1">
            <PageNav />

            <section className="container not-found" aria-labelledby="not-found-title">
                <p className="not-found__code" aria-hidden="true">
                    404
                </p>
                <p className="not-found__kicker">{t('notFound.kicker')}</p>
                <h1 id="not-found-title">{t('notFound.title')}</h1>
                <p className="not-found__description">{t(descriptionKey)}</p>

                <div className="not-found__actions">
                    <Link className="btn btn-primary" to="/">
                        {t('notFound.home')}
                    </Link>
                    <Link className="btn" to="/reflections">
                        {t('notFound.reflections')}
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default NotFoundPage
