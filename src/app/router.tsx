import {Navigate, Route, Routes} from 'react-router-dom'
import MainPage from '../pages/MainPage'
import CryptoPage from '../pages/CryptoPage'
import TravelPage from '../pages/TravelPage'
import ReflexionsPage from '../pages/ReflexionsPage'
import ReflexionArticlePage from '../pages/ReflexionArticlePage'

const Router = () => (
    <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/crypto" element={<CryptoPage/>}/>
        <Route path="/travel" element={<TravelPage/>}/>
        <Route path="/reflexions" element={<ReflexionsPage/>}/>
        <Route path="/reflexions/:slug" element={<ReflexionArticlePage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
)

export default Router