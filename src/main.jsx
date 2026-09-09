import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import i18n from './i18n/i18n.js'
import {languageSwitchUrl} from './config/localizedPaths.js'
import App from './App'
import {initializePerformanceMetrics} from './services/observability/performanceMetrics.js'

// Preserve older shared ?lang= links while making language URLs deterministic.
const requestedLanguage = new URLSearchParams(window.location.search).get('lang')
if (requestedLanguage === 'fr' || requestedLanguage === 'en') {
    window.history.replaceState(
        window.history.state,
        '',
        languageSwitchUrl(window.location.href, requestedLanguage)
    )
    await i18n.changeLanguage(requestedLanguage)
}

initializePerformanceMetrics()

if (import.meta.env.DEV) {
    const accessibilityPreviewParams = new URLSearchParams(window.location.search)
    const shouldLoadAccessibilityPreview = ['axe', 'rgaaSpacing', 'rgaaNoCss'].some((parameter) =>
        accessibilityPreviewParams.has(parameter)
    )

    if (shouldLoadAccessibilityPreview) {
        void import('./test/browserAccessibilityPreview.js')
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
