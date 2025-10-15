import React, { useState } from 'react'
import './nav.css'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiDonateHeart} from 'react-icons/bi'
import {RiServiceLine} from 'react-icons/ri'

const Nav = () => {
    const [activeNav, setActiveNav] = useState('#top')
    return (
        <nav>
            <a href="#top"        onClick={() => setActiveNav('#top')}        className={activeNav === '#top' ? 'active' : ''} aria-label="Home"><AiOutlineHome/></a>
            <a href="#about"      onClick={() => setActiveNav('#about')}      className={activeNav === '#about' ? 'active' : ''} aria-label="About"><AiOutlineUser/></a>
            <a href="#knowledge"  onClick={() => setActiveNav('#knowledge')}  className={activeNav === '#knowledge' ? 'active' : ''} aria-label="Knowledge"><BiBook/></a>
            <a href="#tools"      onClick={() => setActiveNav('#tools')}      className={activeNav === '#tools' ? 'active' : ''} aria-label="Tools"><RiServiceLine/></a>
            <a href="#donation"   onClick={() => setActiveNav('#donation')}   className={activeNav === '#donation' ? 'active' : ''} aria-label="Donation"><BiDonateHeart/></a>
        </nav>
    )
}

export default Nav