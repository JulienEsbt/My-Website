import React from 'react'
import './header.css'
import CTA from './CTA'
import ME from '../../../assets/NFT1.png'
import HeaderSocials from './HeaderSocials'

const Header = () => {
  return (
    <header>
      <div className="container header__container">
        <h5>Hey, I'm</h5>
        <h1>Julienesbt.eth</h1>
        <h5 className='text-light'>Blockchain - Crypto - Investment - Dev</h5>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <img src={ME} alt="me" />
        </div>

        <a href='#contact' className='scroll__down'>Scroll Down</a>
      </div>
    </header>
  )
}

export default Header