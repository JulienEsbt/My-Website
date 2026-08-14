import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import {A11y, Autoplay, EffectCoverflow, Keyboard, Pagination} from 'swiper/modules'
import {FiBookOpen, FiFeather, FiMap, FiPause, FiPlay, FiTarget, FiTool} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import './Goals.css'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
    {key: 'build', icon: <FiTool />},
    {key: 'learn', icon: <FiBookOpen />},
    {key: 'think', icon: <FiFeather />},
    {key: 'travel', icon: <FiMap />},
    {key: 'succeed', icon: <FiTarget />},
]

export default function Goals() {
    const {t} = useTranslation('home')
    const sectionRef = useRef(null)
    const sliderRef = useRef(null)
    const swiperRef = useRef(null)
    const reducedMotion = useReducedMotion()
    const [autoplayPaused, setAutoplayPaused] = useState(false)

    useLayoutEffect(() => {
        if (reducedMotion) return undefined

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
    }, [reducedMotion])

    useEffect(() => {
        const autoplay = swiperRef.current?.autoplay
        if (!autoplay) return

        if (reducedMotion || autoplayPaused) autoplay.stop()
        else autoplay.start()
    }, [autoplayPaused, reducedMotion])

    const toggleAutoplay = () => {
        setAutoplayPaused((isPaused) => !isPaused)
    }

    const paginationBulletMessage = t('goals.paginationBullet').replace('{index}', '{{index}}')

    return (
        <section id="goals" ref={sectionRef}>
            <p className="section-kicker">{t('goals.kicker')}</p>
            <h2>{t('goals.title')}</h2>
            <p className="goals__intro">{t('goals.intro')}</p>

            <div
                className="container goals-carousel"
                ref={sliderRef}
                role="region"
                aria-label={t('goals.carouselAria')}
            >
                <Swiper
                    modules={[A11y, Autoplay, EffectCoverflow, Keyboard, Pagination]}
                    effect={reducedMotion ? 'slide' : 'coverflow'}
                    grabCursor
                    centeredSlides
                    loop
                    slidesPerView="auto"
                    speed={reducedMotion ? 0 : 300}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 120,
                        modifier: 1.7,
                        slideShadows: false,
                    }}
                    autoplay={
                        reducedMotion
                            ? false
                            : {
                                  delay: 5200,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true,
                              }
                    }
                    keyboard={{enabled: true, onlyInViewport: true}}
                    a11y={{
                        containerMessage: t('goals.carouselAria'),
                        paginationBulletMessage,
                    }}
                    pagination={{clickable: true}}
                    className="goals-carousel__swiper"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                >
                    {ITEMS.map((item, index) => (
                        <SwiperSlide key={item.key} className="goals-carousel__slide">
                            <article className="goal-card">
                                <span className="goal-card__number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className="goal-card__icon" aria-hidden="true">
                                    {item.icon}
                                </div>

                                <span className="goal-card__label">{t('goals.label')}</span>

                                <h3>{t(`goals.items.${item.key}.name`)}</h3>

                                <p>{t(`goals.items.${item.key}.review`)}</p>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {!reducedMotion && (
                    <button
                        type="button"
                        className="goals-carousel__autoplay"
                        onClick={toggleAutoplay}
                    >
                        {autoplayPaused ? (
                            <FiPlay aria-hidden="true" />
                        ) : (
                            <FiPause aria-hidden="true" />
                        )}
                        {autoplayPaused ? t('goals.resume') : t('goals.pause')}
                    </button>
                )}
            </div>
        </section>
    )
}
