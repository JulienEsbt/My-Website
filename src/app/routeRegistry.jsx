import {lazy} from 'react'
import {ROUTE_CATALOG} from '../config/routeCatalog.js'
import {loadNamespace} from '../i18n/i18n.js'
const pageLoaders = import.meta.glob('../pages/*.jsx')
export const APP_ROUTES = Object.values(ROUTE_CATALOG).map(({path, page, namespace}) => ({
    path,
    Component: lazy(() =>
        Promise.all([pageLoaders[`../pages/${page}.jsx`](), loadNamespace(namespace)]).then(
            ([module]) => module
        )
    ),
}))
