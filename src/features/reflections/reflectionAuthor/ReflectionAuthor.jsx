import React from 'react'
import {useTranslation} from 'react-i18next'
import './ReflectionAuthor.css'

const ReflectionAuthor = () => {
    const {t} = useTranslation('reflections')

    return (
        <section id="author" className="container reflexion-author">
            <div className="reflexion-author__card">
                <h3>{t('author.title')}</h3>

                <p>
                    {t('author.text')}
                </p>
            </div>
        </section>
    )
}

export default ReflectionAuthor