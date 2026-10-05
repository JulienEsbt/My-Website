import {useEffect, useLayoutEffect, type ReactNode} from 'react'

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import PageNav from '../../navigation/pageNav/PageNav.jsx'
import Footer from '../footerSection/Footer.jsx'
import {observeSceneViewport} from '../viewport/sceneViewport.js'
import '../viewport/ViewportLayout.css'
import '../viewport/EntryScreen.css'
import '../../mobile/MobileExperience.css'

interface PageFrameProps {
    children: ReactNode
}

const PageFrame = ({children}: PageFrameProps) => {
    useClientLayoutEffect(() => {
        document.getElementById('prerendered-content')?.remove()
        document.documentElement.removeAttribute('data-language-entry-pending')
        const main = document.getElementById('main')
        if (main) return observeSceneViewport(main)
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
