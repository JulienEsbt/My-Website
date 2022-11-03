import React, { useState } from 'react'
import './nav.css'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiDonateHeart} from 'react-icons/bi'
import {RiServiceLine} from 'react-icons/ri'

const Nav = () => {
  const [activeNav, setActiveNav] = useState('#')
  return (
    <nav>
      <a href="#" onClick={() => setActiveNav('#')} className={activeNav === '#' ? 'active' : ''}><AiOutlineHome/></a>
      <a href="#about" onClick={() => setActiveNav('#about')} className={activeNav === '#about' ? 'active' : ''}><AiOutlineUser/></a>
      <a href="#knowledge" onClick={() => setActiveNav('#knowledge')} className={activeNav === '#knowledge' ? 'active' : ''}><BiBook/></a>
      <a href="#tools" onClick={() => setActiveNav('#tools')} className={activeNav === '#tools' ? 'active' : ''}><RiServiceLine/></a>
      <a href="#donation" onClick={() => setActiveNav('#donation')} className={activeNav === '#donation' ? 'active' : ''}><BiDonateHeart/></a>
    </nav>
  )
}

export default Nav