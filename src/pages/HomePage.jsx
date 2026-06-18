import React from 'react'
import PageNav from '../components/common/navigation/pageNav/PageNav'
import Header from '../features/home/header/Header'
import HomeNav from '../features/home/homeNav/HomeNav.jsx'
import About from '../features/home/about/About'
import Experience from "../features/home/experience/Experience.jsx";
import Services from "../features/home/services/Services.jsx";
import Portfolio from "../features/home/portfolio/Portfolio.jsx";
import Goals from "../features/home/goals/Goals.jsx";
import Footer from "../components/common/layout/footerSection/Footer.jsx";
import ContactSection from "../components/common/layout/contactSection/ContactSection.jsx";

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