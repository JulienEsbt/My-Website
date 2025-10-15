import React, { useState } from 'react'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai'
import { BiBook, BiMessageSquareDetail } from 'react-icons/bi'
import { RiServiceLine } from 'react-icons/ri'
import './nav.css'

const Nav = () => {
    const [activeNav, setActiveNav] = useState('#top')
    return (
        <nav>
            <a href="#top"        onClick={() => setActiveNav('#top')}        className={activeNav === '#top' ? 'active' : ''} aria-label="Home"><AiOutlineHome/></a>
            <a href="#about"      onClick={() => setActiveNav('#about')}      className={activeNav === '#about' ? 'active' : ''} aria-label="About"><AiOutlineUser/></a>
            <a href="#experience" onClick={() => setActiveNav('#experience')} className={activeNav === '#experience' ? 'active' : ''} aria-label="Experience"><BiBook/></a>
            <a href="#services"   onClick={() => setActiveNav('#services')}   className={activeNav === '#services' ? 'active' : ''} aria-label="Services"><RiServiceLine/></a>
            <a href="#contact"    onClick={() => setActiveNav('#contact')}    className={activeNav === '#contact' ? 'active' : ''} aria-label="Contact"><BiMessageSquareDetail/></a>
        </nav>
    )
}

export default Nav