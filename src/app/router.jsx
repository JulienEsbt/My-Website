import {Suspense} from 'react'
import {Route, Routes} from 'react-router-dom'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import RouteLoading from '../components/common/feedback/routeLoading/RouteLoading.jsx'
import {APP_ROUTES} from './routeRegistry.jsx'

const Router = () => (
    <Suspense fallback={<RouteLoading />}>
        <Routes>
            {APP_ROUTES.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
)

export default Router
