import React from 'react'
import {useTranslation} from 'react-i18next'
import './ReflexionAuthor.css'

const ReflexionAuthor = () => {
    const {t} = useTranslation('reflexions')

    return (
        <section className="container reflexion-author">
            <div className="reflexion-author__card">
                <h3>{t('author.title')}</h3>

                <p>
                    {t('author.text')}
                </p>
            </div>
        </section>
    )
}

export default ReflexionAuthor