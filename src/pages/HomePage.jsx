import React from 'react'
import {useTranslation} from 'react-i18next'
import Header from '../features/home/header/Header'
import HomeNav from '../features/home/homeNav/HomeNav.jsx'
import About from '../features/home/about/About'
import Experience from '../features/home/experience/Experience.jsx'
import Services from '../features/home/services/Services.jsx'
import Portfolio from '../features/home/portfolio/Portfolio.jsx'
import Goals from '../features/home/goals/Goals.jsx'
import ContactSection from '../components/common/layout/contactSection/ContactSection.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'

const HomePage = () => {
    const {t} = useTranslation('home')
    useDocumentTitle(t('site.title'))

    return (
        <PageFrame>
            <Header />
            <HomeNav />
            <About />
            <Experience />
            <Services />
            <Portfolio />
            <Goals />
            <ContactSection />
        </PageFrame>
    )
}

export default HomePage
