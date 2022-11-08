import React from 'react'
import CV from '../../../assets/main/cv.pdf'

const CTA = () => {
  return (
    <div className='cta'>
        <a href={CV} className='btn' target='_blank' rel="noreferrer">Open CV</a>
        <a href={CV} download className='btn'>Download CV</a>
        <a href="#contact" className='btn btn-primary'>Let's talk</a>
    </div>
  )
}

export default CTA