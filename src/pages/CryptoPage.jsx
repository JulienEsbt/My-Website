import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/crypto/header/Header'
import Nav from '../components/crypto/nav/Nav'
import About from '../components/crypto/about/About'
import Knowledge from '../components/crypto/knowledge/Knowledge'
import Tools from '../components/crypto/tools/Tools'
import Donation from '../components/crypto/donation/Donation'
import Contact from '../components/crypto/contact/Contact'
import Footer from '../components/crypto/footer/Footer'

const CryptoPage = () => {
    return (
        <>
            <div id="top" />
            <main id="main" tabIndex="-1">
                <PageNav />
                <Header />
                <Nav />
                <About />
                <Knowledge />
                <Tools />
                <Donation />
                <Contact />
                <Footer />
            </main>
        </>
    )
}

export default CryptoPage