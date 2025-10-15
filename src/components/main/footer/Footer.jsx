import React from 'react'
import {FaTwitter, FaInstagram} from 'react-icons/fa'
import './footer.css'
import {BsGithub, BsLinkedin} from "react-icons/bs";

const Footer = () => {
    return (
        <footer>
            <a href="#top" className='footer__logo'>Julien ESTERBET</a>

            <ul className='permalinks'>
                <li><a href="#top">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#goals">Goals</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>

            <div className="footer__socials">
                <a aria-label="Instagram" href="https://www.instagram.com/julien.esbt/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a aria-label="Twitter"   href="https://twitter.com/JulienEsbtCrypt"   target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a aria-label="LinkedIn"  href="https://www.linkedin.com/in/julien-esterbet/" target="_blank" rel="noopener noreferrer"><BsLinkedin/></a>
                <a aria-label="GitHub"    href="https://github.com/JulienEsbt"         target="_blank" rel="noopener noreferrer"><BsGithub/></a>
            </div>

            <div className="footer__copyright">
                <small>&copy; Julien Esterbet Portfolio. All rights reserved.</small>
            </div>
        </footer>
    )
}

export default Footer