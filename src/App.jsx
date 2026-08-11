import React from 'react'
import {MotionConfig} from 'framer-motion'
import {BrowserRouter} from 'react-router-dom'
import Router from './app/router.jsx'
import AppShell from './app/AppShell.jsx'

const App = () => (
    <MotionConfig reducedMotion="user">
        <BrowserRouter>
            <AppShell>
                <Router />
            </AppShell>
        </BrowserRouter>
    </MotionConfig>
)

export default App
