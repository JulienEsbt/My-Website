import {useEffect, useLayoutEffect, type ReactNode} from 'react'

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import PageNav from '../../navigation/pageNav/PageNav.jsx'
import Footer from '../footerSection/Footer.jsx'

interface PageFrameProps {
    children: ReactNode
}

const PageFrame = ({children}: PageFrameProps) => {
    useClientLayoutEffect(() => {
        document.getElementById('prerendered-content')?.remove()
    }, [])
    return (
        <>
            <PageNav />
            <main id="main" tabIndex={-1}>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default PageFrame
