import React from 'react'
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import AVATAR1 from '../../../assets/main/Crypto.jpeg'
import AVATAR2 from '../../../assets/main/Helico.jpg'
import AVATAR3 from '../../../assets/main/Fly.jpg'
import AVATAR4 from '../../../assets/main/Shuttle.jpg'
import AVATAR5 from '../../../assets/main/SpaceX.jpg'

import './goals.css'
import 'swiper/css/pagination';
import 'swiper/css';

const data = [
    {
        avatar: AVATAR1,
        name: 'Build',
        review: 'Since I learned how to code, I have been fascinated by the idea of building my own projects. And even more since I learned about Web3 and blockchain.'
    },
    {
        avatar: AVATAR2,
        name: 'Learn',
        review: 'As I am so fascinate about cryptography, cybersecurity, blockchain, and decentralized technologies, I want to learn as much as I can about it.'
    },
    {
        avatar: AVATAR3,
        name: 'Fly',
        review: 'My biggest passion for now. I want to pass my Private Pilot Licence for both planes and helicopters as soon as possible. Flying is my biggest dream and the best sensation ever.'
    },
    {
        avatar: AVATAR4,
        name: 'Travel',
        review: 'I love travelling, and my goal for the future is to be able to travel all around the world and discover new cultures, new places and new inspiring peoples.'
    },
    {
        avatar: AVATAR5,
        name: 'Succeed',
        review: 'I want to innovate, learn, fail, ... and success ! Since I failed in the French Air Force, I know that I want to create value and do entrepreneurship, own companies.'
    }
]


const Goals = () => {
  return (
    <section id='goals'>
      <h5>Some More Personnal</h5>
      <h2>Goals</h2>

      <Swiper className="container testimonials__container" modules={[Pagination]} spaceBetween={40} slidesPerView={1} pagination={{ clickable: true }}>{
          data.map(({avatar, name, review}, index) => {
            return (
              <SwiperSlide key={index} className='testimonials'>
                <div className="client__avatar"><img className="pic" src={avatar} alt={name}/></div>
                <h5 className='client__name'>{name}</h5>
                <small className='client__review'>{review}</small>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </section>
  )
}

export default Goals