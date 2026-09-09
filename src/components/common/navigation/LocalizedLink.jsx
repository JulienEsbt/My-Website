import {forwardRef} from 'react'
import {Link as RouterLink, NavLink as RouterNavLink, useLocation} from 'react-router-dom'
import {languageFromPath, languageSwitchUrl} from '../../../config/localizedPaths.js'

const destination = (to, pathname) =>
    typeof to === 'string' && to.startsWith('/')
        ? languageSwitchUrl(to, languageFromPath(pathname))
        : to

export const Link = forwardRef(function LocalizedLink({to, ...props}, ref) {
    const {pathname} = useLocation()
    return <RouterLink ref={ref} to={destination(to, pathname)} {...props} />
})

export const NavLink = forwardRef(function LocalizedNavLink({to, ...props}, ref) {
    const {pathname} = useLocation()
    return <RouterNavLink ref={ref} to={destination(to, pathname)} {...props} />
})
