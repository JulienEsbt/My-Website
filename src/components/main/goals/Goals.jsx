import React, {useLayoutEffect, useRef} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper/modules'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

import AVATAR1 from '../../../assets/main/Crypto.jpeg'
import AVATAR2 from '../../../assets/main/Helico.jpg'
import AVATAR3 from '../../../assets/main/Fly.jpg'
import AVATAR4 from '../../../assets/main/Shuttle.jpg'
import AVATAR5 from '../../../assets/main/SpaceX.jpg'

import 'swiper/css'
import 'swiper/css/pagination'
import './goals.css'

gsap.registerPlugin(ScrollTrigger)

const items = [
    {key: 'build', avatar: AVATAR1},
    {key: 'learn', avatar: AVATAR2},
    {key: 'fly', avatar: AVATAR3},
    {key: 'travel', avatar: AVATAR4},
    {key: 'succeed', avatar: AVATAR5},
]

const PART_INDEX = {avatar: 0, name: 1, review: 2}

export default function Goals() {
    const {t} = useTranslation()
    const sectionRef = useRef(null)
    const swiperRef = useRef(null)

    // on stocke TOUTES les refs des slides à la suite: [s0-avatar, s0-name, s0-review, s1-avatar, ...]
    const cardRefs = useRef([])

    const setPartRef = (slideIdx, part) => (el) => {
        const base = slideIdx * 3
        const idx = base + PART_INDEX[part]
        cardRefs.current[idx] = el
    }

    useLayoutEffect(() => {
        const el = sectionRef.current
        const parts = cardRefs.current.filter(Boolean)

        const ctx = gsap.context(() => {
            // fade-in de la section
            gsap.from(el, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {trigger: el, start: 'top 80%'},
            })

            // apparition en cascade de TOUTES les parties (toutes slides confondues)
            gsap.from(parts, {
                opacity: 0,
                y: 16,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.06,
                scrollTrigger: {trigger: el, start: 'top 72%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="goals" ref={sectionRef}>
            <h5>{t('goals.kicker')}</h5>
            <h2>{t('goals.title')}</h2>

            <Swiper
                className="container testimonials__container"
                modules={[Pagination]}
                spaceBetween={40}
                slidesPerView={1}
                pagination={{clickable: true}}
                ref={swiperRef}
            >
                {items.map(({key, avatar}, i) => (
                    <SwiperSlide key={key} className="testimonials">
                        <div className="client__avatar" ref={setPartRef(i, 'avatar')}>
                            <img className="pic" src={avatar} alt={t(`goals.items.${key}.name`)}/>
                        </div>

                        <h5 className="client__name" ref={setPartRef(i, 'name')}>
                            {t(`goals.items.${key}.name`)}
                        </h5>

                        <small className="client__review" ref={setPartRef(i, 'review')}>
                            {t(`goals.items.${key}.review`)}
                        </small>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}