import React from 'react'
import './footer.css'
import {FaTwitter, FaInstagram, FaTiktok} from 'react-icons/fa'
import {BsYoutube} from 'react-icons/bs'
import {BsLinkedin, BsGithub} from 'react-icons/bs'

const Footer = () => {
  return (
    <footer>
      <a href="#" className='footer__logo'>Julien ESTERBET</a>

      <ul className='permalinks'>
        <li><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#testimonials">Donation</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="footer__socials">
        <a href="https://twitter.com/JulienEsbtCrypt" target='_blank' rel="noreferrer"><FaTwitter /></a>
        <a href="https://www.youtube.com/channel/UC8cax5btmg1s7V2Skt5kNBg" target='_blank' rel="noreferrer"><BsYoutube /></a>
        <a href="https://www.tiktok.com/@julienesbtcrypto" target='_blank' rel="noreferrer"><FaTiktok /></a>
        <a href="https://www.instagram.com/julienesbtcrypto/" target='_blank' rel="noreferrer"><FaInstagram /></a>
        <a href='https://www.linkedin.com/in/julien-esterbet/' target='_blank' rel="noreferrer"><BsLinkedin/></a>
        <a href='https://github.com/JulienEsbt' target='_blank' rel="noreferrer"><BsGithub/></a>
      </div>

      <div className="footer__copyright">
        <small>&copy; Julien Esterbet Portfolio. All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer