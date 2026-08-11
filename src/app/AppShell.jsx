import AppErrorBoundary from '../components/common/feedback/appErrorBoundary/AppErrorBoundary.jsx'
import SkipLink from '../components/common/accessibility/SkipLink.jsx'
import ScrollToTop from '../components/common/scrollToTop/ScrollToTop.jsx'

const AppShell = ({children}) => (
    <AppErrorBoundary>
        <SkipLink />
        <ScrollToTop />
        {children}
    </AppErrorBoundary>
)

export default AppShell
