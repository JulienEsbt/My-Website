import React from 'react'
import { FaBitcoin, FaEthereum, FaCodeBranch, FaFileCode } from 'react-icons/fa'
import { BiLineChart } from 'react-icons/bi'
import { BsCurrencyExchange } from 'react-icons/bs'
import ME from '../../../assets/crypto/NFT2.png'
import './about.css'

const About = () => {
  return (
    <section id='about'>
      <h5>What I Do</h5>
      <h2>Who Am I</h2>

      <div className='container about__container'>
        <div className='about__me'>
          <div className="about__me-image">
            <img src={ME} alt="Coworking" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards"> 
            <article className='about__card'>
              <FaBitcoin className='about__icon'/> <FaEthereum className='about__icon'/>
              <h5>Passionnate</h5>
              <small>By Blockchain Technology</small>
            </article>

            <article className='about__card'>
              <BsCurrencyExchange className='about__icon'/> <BiLineChart className='about__icon'/>
              <h5>Investing</h5>
              <small>On Crypto Projects</small>
            </article>

            <article className='about__card'>
              <FaCodeBranch className='about__icon'/> <FaFileCode className='about__icon'/>
              <h5>Developping</h5>
              <small>EVM Smarts Contracts</small>
            </article>
          </div>

          <p>
            Hi there! I'm a Blockchain Developer and Crypto Investor. I'm passionate about Blockchain Technology and investing on Crypto Projects.
            I'm also developing Smarts Contracts with solidity and FrontEnd app with ReactJS.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About