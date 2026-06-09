import {Navigate, Route, Routes} from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Web3Page from '../pages/Web3Page'
import TravelPage from '../pages/TravelPage'
import ReflexionsPage from '../pages/ReflexionsPage'
import ReflexionArticlePage from '../pages/ReflexionArticlePage'

const Router = () => (
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/web3" element={<Web3Page/>}/>
        <Route path="/travel" element={<TravelPage/>}/>
        <Route path="/reflections" element={<ReflexionsPage/>}/>
        <Route path="/reflections/:slug" element={<ReflexionArticlePage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
)

export default Router