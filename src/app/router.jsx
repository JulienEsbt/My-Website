import {Suspense, useEffect, useLayoutEffect} from 'react'
import {Route, Routes, useLocation} from 'react-router-dom'
import i18n from '../i18n/i18n.js'
import {languageFromPath} from '../config/localizedPaths.js'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import RouteLoading from '../components/common/feedback/routeLoading/RouteLoading.jsx'
import {APP_ROUTES} from './routeRegistry.jsx'

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
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}

export default Router
