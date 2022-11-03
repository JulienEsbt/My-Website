import React from 'react'
import { BsGithub } from 'react-icons/bs'
import IMG1 from '../../../assets/main/Megalis.png'
import IMG2 from '../../../assets/main/FFNN.png'
import IMG3 from '../../../assets/main/Wave.png'
import './portfolio.css'

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'EVM Compatible Smart Contract that allows users to archive files on the Blockchain',
    github: 'https://github.com/JulienEsbt/Megalis-Smart-Contract'
  },
  {
    id: 2,
    image: IMG2,
    title: 'Multi-Layer Feed-Forward Neural Network in Python using Machine Learning',
    github: 'https://github.com/JulienEsbt/Neural-Networks-in-Pure-NumPy'
  },
  {
    id: 3,
    image: IMG3,
    title: 'A messenger-like App and Smart Contract that store message on the Blockchain',
    github: 'https://github.com/JulienEsbt/My-Wave-Portal-Front'
  }
]

const Portfolio = () => {
  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className='container portfolio__container'>
        {
          data.map(({id, image, title, github}) => {
            return (
              <article key={id} className='portfolio__item'>
                <div className='portfolio__item-image'>
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} target='_blank' rel="noreferrer" className='btn'><BsGithub/> GitHub <BsGithub/></a>
                </div>
              </article>
            )
          })
        }
      </div>
    </section>
  )
}

export default Portfolio