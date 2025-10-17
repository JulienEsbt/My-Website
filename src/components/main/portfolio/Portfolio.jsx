import React, {useLayoutEffect, useRef} from 'react'
import {BsGithub} from 'react-icons/bs'
import {useTranslation} from 'react-i18next'
import IMG1 from '../../../assets/main/Megalis.png'
import IMG2 from '../../../assets/main/FFNN.png'
import IMG3 from '../../../assets/main/Wave.png'
import './portfolio.css'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const data = [
    {id: '1', image: IMG1, github: 'https://github.com/JulienEsbt/Megalis-Smart-Contract'},
    {id: '2', image: IMG2, github: 'https://github.com/JulienEsbt/Neural-Networks-in-Pure-NumPy'},
    {id: '3', image: IMG3, github: 'https://github.com/JulienEsbt/My-Wave-Portal-Front'}
]

export default function Portfolio() {
    const {t} = useTranslation(['common'])
    const sectionRef = useRef(null)
    const imgRef = useRef(null)
    const cardsRef = useRef([])
    const textRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Apparition globale
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            })

            // Image
            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px',
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            )

            // Flottement permanent
            gsap.to(imgRef.current, {
                '--ty': '-=6px',
                yoyo: true,
                repeat: -1,
                duration: 3,
                ease: 'sine.inOut',
            })

            // Cartes
            gsap.fromTo(
                cardsRef.current,
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px',
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            )

            // Paragraphe
            gsap.from(textRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="portfolio" ref={sectionRef}>
            <h5>{t('portfolio.kicker')}</h5>
            <h2>{t('portfolio.title')}</h2>

            <div className="container portfolio__container" ref={imgRef}>
                {data.map(({id, image, github}) => (
                    <article key={id} className="portfolio__item">
                        <div className="portfolio__item-image" ref={(el) => (cardsRef.current[id] = el)}>
                            <img src={image} alt={t(`portfolio.items.${id}.title`)}/>
                        </div>
                        <h3>{t(`portfolio.items.${id}.title`)}</h3>
                        <div className="portfolio__item-cta">
                            <a className="btn" href={github} target="_blank" rel="noreferrer" ref={textRef}>
                                <BsGithub/> {t('portfolio.cta')} <BsGithub/>
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
