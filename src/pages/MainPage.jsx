import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/main/header/Header'
import Nav from '../components/main/nav/Nav'
import About from '../components/main/about/About'
import Experience from "../components/main/experience/Experience.jsx";
import Services from "../components/main/services/Services.jsx";
import Portfolio from "../components/main/portfolio/Portfolio.jsx";
import Goals from "../components/main/goals/Goals.jsx";
import Contact from "../components/main/contact/Contact.jsx";
import Footer from '../components/main/footer/Footer.jsx';

const MainPage = () => {
    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>
                <Header/>
                <Nav/>
                <About/>
                <Experience/>
                <Services/>
                <Portfolio/>
                <Goals/>
                <Contact/>
                <Footer/>
            </main>
        </>
    )
}

export default MainPage