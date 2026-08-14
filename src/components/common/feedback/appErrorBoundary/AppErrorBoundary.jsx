import React, {Component} from 'react'
import {useTranslation} from 'react-i18next'
import './AppErrorBoundary.css'

class ErrorBoundary extends Component {
    state = {hasError: false}

    static getDerivedStateFromError() {
        return {hasError: true}
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error('Unexpected application error', error, errorInfo)
        }
    }

    render() {
        if (!this.state.hasError) return this.props.children

        const {kicker, title, description, home, retry} = this.props.messages

        return (
            <main id="main" className="app-error" tabIndex="-1">
                <section className="container app-error__card" role="alert">
                    <p className="app-error__kicker">{kicker}</p>
                    <h1>{title}</h1>
                    <p>{description}</p>

                    <div className="app-error__actions">
                        <a className="btn btn-primary" href="/">
                            {home}
                        </a>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => window.location.reload()}
                        >
                            {retry}
                        </button>
                    </div>
                </section>
            </main>
        )
    }
}

const AppErrorBoundary = ({children}) => {
    const {t} = useTranslation('common')

    const messages = {
        kicker: t('errorBoundary.kicker'),
        title: t('errorBoundary.title'),
        description: t('errorBoundary.description'),
        home: t('errorBoundary.home'),
        retry: t('errorBoundary.retry'),
    }

    return <ErrorBoundary messages={messages}>{children}</ErrorBoundary>
}

export default AppErrorBoundary
