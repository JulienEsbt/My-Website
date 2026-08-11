import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n/i18n.js'
import App from './App'
import {initializePerformanceMetrics} from './services/observability/performanceMetrics.js'

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
