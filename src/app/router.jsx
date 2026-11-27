import {lazy, Suspense, useEffect, useLayoutEffect, useRef} from 'react'
import {Navigate, Route, Routes, useLocation, useNavigationType} from 'react-router-dom'
import i18n from '../i18n/i18n.js'
import {languageFromPath, unlocalizedPath} from '../config/localizedPaths.js'
import RouteLoading from '../components/common/feedback/routeLoading/RouteLoading.jsx'
import {APP_ROUTES} from './routeRegistry.jsx'

const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))

const RouteFocus = () => {
    const {pathname: localizedPathname, hash, key, state} = useLocation()
    const pathname = unlocalizedPath(localizedPathname)
    const navigationType = useNavigationType()
    const travelOrigin = state?.travelTimelineOrigin
    const previousRoute = useRef(null)

    useEffect(() => {
        const previous = previousRoute.current
        previousRoute.current = {pathname, travelOrigin}
        if (!previous || previous.pathname === pathname || hash) return
        // The travel dialog owns focus while opening and returning to the timeline.
        if (travelOrigin || (navigationType === 'POP' && previous.travelOrigin === key)) return

        if (document.activeElement === document.body) {
            document.getElementById('main')?.focus({preventScroll: true})
        }
    }, [pathname, hash, key, navigationType, travelOrigin])

    return null
}

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
            <RouteFocus />
        </Suspense>
    )
}

export default Router
