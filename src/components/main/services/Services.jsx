import React from 'react'
import { BiCheck } from 'react-icons/bi'
import './services.css'

const Services = () => {
  return (
    <section id='services'>
      <h5>What I Offer</h5>
      <h2>Services</h2>

      <div className='.container services__container'>
        <article className='service'>
          <div className='service__head'>
            <h3>BackEnd</h3>
          </div>
          <ul className='service__list'>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Machine Learning Projects</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Simple Games</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Text Editor</p>
            </li>
          </ul>
        </article>

        <article className='service'>
          <div className='service__head'>
            <h3>Web Development</h3>
          </div>
          <ul className='service__list'>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Showcase Website</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Portfolio</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Decentralized App FrontEnd</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Blockchain App</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>NFTs App</p>
            </li>
          </ul>
        </article>

        <article className='service'>
          <div className='service__head'>
            <h3>Blockchain Solution</h3>
          </div>
          <ul className='service__list'>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Smart Contract Creation</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Decentralized App</p>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <p>(Blockchain Formation/Lesson)</p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Services