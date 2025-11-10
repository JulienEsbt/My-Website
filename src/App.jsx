import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import MainPage from './pages/MainPage'
import CryptoPage from './pages/CryptoPage'

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/crypto" element={<CryptoPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    </Router>
)

export default App