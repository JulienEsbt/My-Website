import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/main/header/Header'
import About from '../components/main/about/About'

const MainPage = () => {
    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>
                <Header/>
                {/*<Nav/>*/}
                <About/>
                {/*  <Experience/>
                <Services/>
                <Portfolio/>
                <Goals/>
                <Contact/>
                <Footer/>*/}
            </main>
        </>
    )
}

export default MainPage