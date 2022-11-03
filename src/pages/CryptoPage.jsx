import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/crypto/header/Header'
import Nav from '../components/crypto/nav/Nav'
import About from '../components/crypto/about/About'
import Experience from '../components/crypto/experience/Experience'
import Services from '../components/crypto/services/Services'
import Testimonials from '../components/crypto/testimonials/Testimonials'
import Contact from '../components/crypto/contact/Contact'
import Footer from '../components/crypto/footer/Footer'

const CryptoPage = () => {
  return (
    <div>
      <PageNav />
      <Header />
      <Nav />
      <About />
      <Experience />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default CryptoPage