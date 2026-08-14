import {IconContext} from 'react-icons'
import AppErrorBoundary from '../components/common/feedback/appErrorBoundary/AppErrorBoundary.jsx'
import SkipLink from '../components/common/accessibility/SkipLink.jsx'
import ScrollToTop from '../components/common/scrollToTop/ScrollToTop.jsx'
import SeoManager from '../components/common/seo/SeoManager.jsx'

const DECORATIVE_ICON_PROPS = {
    attr: {'aria-hidden': 'true', focusable: 'false'},
}

const AppShell = ({children}) => (
    <IconContext.Provider value={DECORATIVE_ICON_PROPS}>
        <AppErrorBoundary>
            <SeoManager />
            <SkipLink />
            <ScrollToTop />
            {children}
        </AppErrorBoundary>
    </IconContext.Provider>
)

export default AppShell
