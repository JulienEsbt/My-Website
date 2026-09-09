import React from 'react'
import {Analytics} from '@vercel/analytics/react'
import {SpeedInsights} from '@vercel/speed-insights/react'
import {MotionConfig} from 'framer-motion'
import {BrowserRouter} from 'react-router-dom'
import Router from './app/router.jsx'
import {languageFromPath} from './config/localizedPaths.js'
import AppShell from './app/AppShell.jsx'

const App = () => (
    <>
        <MotionConfig reducedMotion="user">
            <BrowserRouter
                basename={languageFromPath(window.location.pathname) === 'en' ? '/en' : '/'}
            >
                <AppShell>
                    <Router />
                </AppShell>
            </BrowserRouter>
        </MotionConfig>
        <Analytics />
        <SpeedInsights />
    </>
)

export default App
