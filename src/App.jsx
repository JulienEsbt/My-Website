import React from 'react'
import {Analytics} from '@vercel/analytics/react'
import {SpeedInsights} from '@vercel/speed-insights/react'
import {MotionConfig} from 'framer-motion'
import {BrowserRouter} from 'react-router-dom'
import Router from './app/router.jsx'
import AppShell from './app/AppShell.jsx'

const App = () => (
    <>
        <MotionConfig reducedMotion="user">
            <BrowserRouter>
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
