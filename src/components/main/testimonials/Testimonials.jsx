import React from 'react'
import './testimonials.css'
import AVATAR1 from '../../../assets/us-air-force-general-dynamics-f-16-fighting-falcon-alaska-wallpaper-preview.jpg'
import AVATAR2 from '../../../assets/spacex-photography-long-exposure-rocket-wallpaper-preview.jpg'

// import Swiper core and required modules
import { Pagination } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


const data = [
  {
    avatar: AVATAR1, 
    name: 'Remi Tiso',
    review: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Iusto quod, quas, voluptas, quibusdam.'
  },
  {
    avatar: AVATAR2,
    name: 'Remi Tiso',
    review: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Iusto quod, quas, voluptas, quibusdam.'
  }
]


const Testimonials = () => {
  return (
    <section id='testimonials'>
      <h5>Review from client</h5>
      <h2>Testimonials</h2>

      <Swiper className="container testimonials__container"
        // install Swiper modules
        modules={[Pagination]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}>
        {
          data.map(({avatar, name, review}, index) => {
            return (
              <SwiperSlide key={index} className='testimonials'>
                <div className="client__avatar">
                  <img src={avatar}/>
                </div>
                <h5 className='client__name'>{name}</h5>
                <small className='client__review'>{review}</small>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
      {/*<article className='testimonials'>
          <div className="client__avatar">
            <img src={AVATAR1} alt="Avatar One" />
          </div>
          <h5 className='client__name'>Remi Tiso</h5>
          <small className='client__review'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Iusto quod, quas, voluptas, quibusdam.
          </small>
        </article>*/}
    </section>
  )
}

export default Testimonials