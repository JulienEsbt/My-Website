import React from 'react'
import useChapterTransition from '../features/home/useChapterTransition.js'
import Header from '../features/home/header/Header'
import HomeNav from '../features/home/homeNav/HomeNav.jsx'
import About from '../features/home/about/About'
import Experience from '../features/home/experience/Experience.jsx'
import Services from '../features/home/services/Services.jsx'
import Portfolio from '../features/home/portfolio/Portfolio.jsx'
import HomeDiscover from '../features/home/discover/HomeDiscover.jsx'
import Goals from '../features/home/goals/Goals.jsx'
import ContactSection from '../components/common/layout/contactSection/ContactSection.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'

const HomePage = () => {
    useChapterTransition()
    return (
        <PageFrame>
            <Header />
            <HomeNav />
            <About />
            <Portfolio />
            <Experience />
            <Services />
            <Goals />
            <HomeDiscover />
            <ContactSection />
        </PageFrame>
    )
}

export default HomePage
