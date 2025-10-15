import React from 'react';
import MainPage from './pages/MainPage';
import CryptoPage from './pages/CryptoPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/crypto" element={<CryptoPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;