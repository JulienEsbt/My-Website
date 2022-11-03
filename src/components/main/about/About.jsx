import React from 'react'
import { FaAward } from 'react-icons/fa'
import { FiUsers } from 'react-icons/fi'
import { VscFolderLibrary } from 'react-icons/vsc'
import ME from '../../../assets/main/Me2.jpg'
import './about.css'

const About = () => {
  return (
    <section id='about'>
      <h5>Get to Know</h5>
      <h2>About Me</h2>

      <div className='container about__container'>
        <div className='about__me'>
          <div className="about__me-image">
            <img src={ME} alt="NFT" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className='about__card'>
              <FaAward className='about__icon'/>
              <h5>Experience</h5>
              <small>5+ Years Coding</small>
            </article>

            <article className='about__card'>
              <FiUsers className='about__icon'/>
              <h5>Relations</h5>
              <small>300+</small>
            </article>

            <article className='about__card'>
              <VscFolderLibrary className='about__icon'/>
              <h5>Projects</h5>
              <small>20+ Completed</small>
            </article>
          </div>

          <p>
            I am a 23 years old student in a european master cursus, learning computer science, fintech and entrepreneurship.
            I am passionnate about dev, new techs, blockchain, finance, aeronautic, motorsports, travelling, cryptocurrencies, aerospace, etc.
            Quit a lot of things, and I am always open to new things and new experiences.
          </p>

        </div>
      </div>
    </section>
  )
}

export default About