import {lazy, Suspense, useEffect, useLayoutEffect} from 'react'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import i18n from '../i18n/i18n.js'
import {languageFromPath} from '../config/localizedPaths.js'
import RouteLoading from '../components/common/feedback/routeLoading/RouteLoading.jsx'
import {APP_ROUTES} from './routeRegistry.jsx'

const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
const Router = () => {
    const {pathname} = useLocation()
    useClientLayoutEffect(() => {
        const language = languageFromPath(pathname)
        if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language)
    }, [pathname])
    return (
        <Suspense fallback={<RouteLoading />}>
            <Routes>
                {APP_ROUTES.map(({path, Component}) => (
                    <Route
                        key={path}
                        path={path === '/' ? '/en?' : `/en?${path}`}
                        element={<Component />}
                    />
                ))}
                <Route path="/journal" element={<Navigate to="/" replace />} />
                <Route path="/en/journal" element={<Navigate to="/en" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}

export default Router
