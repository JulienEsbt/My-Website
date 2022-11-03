import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/main/header/Header'
import Nav from '../components/main/nav/Nav'
import About from '../components/main/about/About'
import Experience from '../components/main/experience/Experience'
import Services from '../components/main/services/Services'
import Portfolio from '../components/main/portfolio/Portfolio'
import Goals from '../components/main/goals/Goals'
import Contact from '../components/main/contact/Contact'
import Footer from '../components/main/footer/Footer'

const MainPage = () => {
  return (
    <>
      <PageNav />
      <Header />
      <Nav />
      <About />
      <Experience />
      <Services />
      <Portfolio />
      <Goals />
      <Contact />
      <Footer />
    </>
  )
}

export default MainPage