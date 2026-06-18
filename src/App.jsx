import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import Router from './app/router.jsx'
import ScrollToTop from './components/common/scrollToTop/ScrollToTop'

const App = () => (
    <BrowserRouter>
        <ScrollToTop/>
        <Router/>
    </BrowserRouter>
)

export default App