import React from 'react'
import PageNav from '../../navigation/pageNav/PageNav.jsx'
import Footer from '../footerSection/Footer.jsx'

const PageFrame = ({children}) => {
    return (
        <>
            <PageNav />
            <main id="main" tabIndex="-1">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default PageFrame
