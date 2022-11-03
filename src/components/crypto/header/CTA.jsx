import React from 'react'
import { BsYoutube } from 'react-icons/bs'
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa'

const CTA = () => {
  return (
    <div className='cta'>
        <a href="https://twitter.com/JulienEsbtCrypt" className='icon icon-primary' target='_blank' rel="noreferrer"><FaTwitter /></a>
        <a href="https://www.youtube.com/channel/UC8cax5btmg1s7V2Skt5kNBg" className='icon' target='_blank' rel="noreferrer"><BsYoutube /></a>
        <a href="https://www.tiktok.com/@julienesbtcrypto" className='icon icon-primary' target='_blank' rel="noreferrer"><FaTiktok /></a>
        <a href="https://www.instagram.com/julienesbtcrypto/" className='icon' target='_blank' rel="noreferrer"><FaInstagram /></a>
    </div>
  )
}

export default CTA