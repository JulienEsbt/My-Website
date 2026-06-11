import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/home/header/Header'
import HomeNav from '../components/home/homeNav/HomeNav.jsx'
import About from '../components/home/about/About'
import Experience from "../components/home/experience/Experience.jsx";
import Services from "../components/home/services/Services.jsx";
import Portfolio from "../components/home/portfolio/Portfolio.jsx";
import Goals from "../components/home/goals/Goals.jsx";
import Footer from "../components/common/footerSection/Footer.jsx";
import ContactSection from "../components/common/contactSection/contactSection.jsx";

const HomePage = () => {
    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>
                <Header/>
                <HomeNav/>
                <About/>
                <Experience/>
                <Services/>
                <Portfolio/>
                <Goals/>
                <ContactSection/>
                <Footer/>
            </main>
        </>
    )
}

export default HomePage