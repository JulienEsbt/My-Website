import React from 'react'
import {FaTwitter, FaInstagram} from 'react-icons/fa'
import './footer.css'
import {BsGithub, BsLinkedin} from "react-icons/bs";

const Footer = () => {
  return (
    <footer>
      <a href="#" className='footer__logo'>Julien ESTERBET</a>

      <ul className='permalinks'>
        <li><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#goals">Goals</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="footer__socials">
          <a href="https://www.instagram.com/julien.esbt/"><FaInstagram /></a>
          <a href="https://twitter.com/JulienEsbtCrypt" target='_blank' rel="noreferrer"><FaTwitter /></a>
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