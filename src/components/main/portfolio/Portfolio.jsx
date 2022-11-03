import React from 'react'
import './portfolio.css'
import {BsGithub} from 'react-icons/bs'
import IMG1 from '../../../assets/istockphoto-876612206-170667a.jpg'
import IMG2 from '../../../assets/us-air-force-general-dynamics-f-16-fighting-falcon-alaska-wallpaper-preview.jpg'

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'Project 1',
    github: 'https://github.com/JulienEsbt',
    demo: 'https://github.com/JulienEsbt'
  },
  {
    id: 2,
    image: IMG2,
    title: 'Project 2',
    github: 'https://github.com/JulienEsbt',
    demo: 'https://github.com/JulienEsbt'
  }
]

const Portfolio = () => {
  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className='container portfolio__container'>
        {
          data.map(({id, image, title, github, demo}) => {
            return (
              <article key={id} className='portfolio__item'>
                <div className='portfolio__item-image'>
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} target='_blank' rel="noreferrer" className='btn'><BsGithub/> GitHub <BsGithub/></a>
                  <a href={demo} target='_blank' rel="noreferrer" className='btn btn-primary'>Live Demo</a>
                </div>
              </article>
            )
          })
        }
        {/*<article className='portfolio__item'>
          <div className='portfolio__item-image'>
            <img src={IMG1} alt="" />
          </div>
          <h3>This is a portfolio item title</h3>
          <div className="portfolio__item-cta">
            <a href='https://github.com/JulienEsbt' target='_blank' rel="noreferrer" className='btn'><BsGithub/> GitHub <BsGithub/></a>
            <a href='https://github.com/JulienEsbt' target='_blank' rel="noreferrer" className='btn btn-primary'>Live Demo</a>
          </div>
        </article>*/}
      </div>
    </section>
  )
}

export default Portfolio