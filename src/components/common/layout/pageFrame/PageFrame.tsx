import type {ReactNode} from 'react'
import PageNav from '../../navigation/pageNav/PageNav.jsx'
import Footer from '../footerSection/Footer.jsx'

interface PageFrameProps {
    children: ReactNode
}

const PageFrame = ({children}: PageFrameProps) => (
    <>
        <PageNav />
        <main id="main" tabIndex={-1}>
            {children}
        </main>
        <Footer />
    </>
)

export default PageFrame
