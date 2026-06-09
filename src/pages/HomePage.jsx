import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/home/header/Header'
import Nav from '../components/home/nav/Nav'
import About from '../components/home/about/About'
import Experience from "../components/home/experience/Experience.jsx";
import Services from "../components/home/services/Services.jsx";
import Portfolio from "../components/home/portfolio/Portfolio.jsx";
import Goals from "../components/home/goals/Goals.jsx";
import Contact from "../components/home/contact/Contact.jsx";
import Footer from '../components/home/footer/Footer.jsx';

const HomePage = () => {
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

export default HomePage