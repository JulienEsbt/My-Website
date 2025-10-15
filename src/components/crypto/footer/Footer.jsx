import React from 'react'
import './footer.css'
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'
import { BsYoutube } from 'react-icons/bs'
import { BsLinkedin, BsGithub } from 'react-icons/bs'

const Footer = () => {
    return (
        <footer>
            <a href="#top" className='footer__logo'>Julien ESTERBET</a>

            <ul className='permalinks'>
                <li><a href="#top">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#knowledge">Knowledge</a></li>
                <li><a href="#tools">Tools</a></li>
                <li><a href="#donation">Donation</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>

            <div className="footer__socials">
                <a aria-label="Twitter"   href="https://twitter.com/JulienEsbtCrypt" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a aria-label="YouTube"   href="https://www.youtube.com/channel/UC8cax5btmg1s7V2Skt5kNBg" target="_blank" rel="noopener noreferrer"><BsYoutube /></a>
                <a aria-label="TikTok"    href="https://www.tiktok.com/@julienesbtcrypto" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                <a aria-label="Instagram" href="https://www.instagram.com/julienesbtcrypto/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a aria-label="LinkedIn"  href="https://www.linkedin.com/in/julien-esterbet/" target="_blank" rel="noopener noreferrer"><BsLinkedin/></a>
                <a aria-label="GitHub"    href="https://github.com/JulienEsbt" target="_blank" rel="noopener noreferrer"><BsGithub/></a>
            </div>

            <div className="footer__copyright">
                <small>&copy; Julien Esterbet Portfolio. All rights reserved.</small>
            </div>
        </footer>
    )
}

export default Footer