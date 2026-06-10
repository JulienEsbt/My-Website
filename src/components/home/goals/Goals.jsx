import React, {useLayoutEffect, useRef} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {EffectCoverflow, Pagination, Autoplay} from 'swiper/modules'
import {FiTool, FiBookOpen, FiFeather, FiMap, FiTarget} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import './goals.css'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
    {key: 'build', icon: <FiTool/>},
    {key: 'learn', icon: <FiBookOpen/>},
    {key: 'think', icon: <FiFeather/>},
    {key: 'travel', icon: <FiMap/>},
    {key: 'succeed', icon: <FiTarget/>},
]

export default function Goals() {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const sliderRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })

            gsap.from(sliderRef.current, {
                opacity: 0,
                y: 24,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 72%'},
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="goals" ref={sectionRef}>
            <h5>{t('goals.kicker')}</h5>
            <h2>{t('goals.title')}</h2>
            <p className="goals__intro">{t('goals.intro')}</p>

            <div className="container goals-carousel" ref={sliderRef}>
                <Swiper
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    loop
                    slidesPerView="auto"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 120,
                        modifier: 1.7,
                        slideShadows: false,
                    }}
                    autoplay={{
                        delay: 5200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{clickable: true}}
                    className="goals-carousel__swiper"
                >
                    {ITEMS.map((item, index) => (
                        <SwiperSlide key={item.key} className="goals-carousel__slide">
                            <article className="goal-card">
                                <span className="goal-card__number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className="goal-card__icon">
                                    {item.icon}
                                </div>

                                <span className="goal-card__label">
                                    {t('goals.label')}
                                </span>

                                <h3>{t(`goals.items.${item.key}.name`)}</h3>

                                <p>{t(`goals.items.${item.key}.review`)}</p>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}