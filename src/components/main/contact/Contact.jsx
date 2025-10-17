import React, {useLayoutEffect, useRef} from 'react';
import emailjs from 'emailjs-com';
import {MdOutlineEmail} from 'react-icons/md';
import {FaTwitter, FaLinkedin} from 'react-icons/fa';
import './contact.css';
import {useTranslation} from 'react-i18next';
import {gsap} from 'gsap';

const Contact = () => {
    const {t} = useTranslation(); // avec ta config en.json / fr.json (namespace par défaut)

    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const cardsRef = useRef([]);
    const textRef = useRef(null);
    const form = useRef(null); // <= ref unique pour emailjs

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            });

            gsap.fromTo(
                imgRef.current,
                {'--ty': '40px', opacity: 0},
                {
                    '--ty': '0px', opacity: 1, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
                }
            );

            gsap.to(imgRef.current, {
                '--ty': '-=6px', yoyo: true, repeat: -1, duration: 3, ease: 'sine.inOut',
            });

            gsap.fromTo(
                cardsRef.current,
                {'--y': '20px', opacity: 0},
                {
                    '--y': '0px', opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12,
                    scrollTrigger: {trigger: sectionRef.current, start: 'top 75%'},
                }
            );

            gsap.from(textRef.current, {
                opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.1,
                scrollTrigger: {trigger: sectionRef.current, start: 'top 70%'},
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs
            .sendForm('service_me0jfjg', 'template_mwmosps', form.current, 'QgbIYSLquY8PrqQho')
            .then(() => alert(t('contact.form.success')))
            .catch(() => alert(t('contact.form.error')));
        e.target.reset();
    };

    return (
        <section id="contact" ref={sectionRef}>
            <h5>{t('contact.kicker')}</h5>
            <h2>{t('contact.title')}</h2>

            <div className="container contact__container">
                {/* Options */}
                <div className="contact__options" ref={imgRef}>
                    <article className="contact__option" ref={(el) => (cardsRef.current[0] = el)}>
                        <MdOutlineEmail className="contact__option-icon"/>
                        <h4>{t('contact.options.email.title')}</h4>
                        <h5>{t('contact.options.email.value')}</h5>
                        <a href="mailto:julien.esterbet@gmail.com" target="_blank" rel="noreferrer">
                            {t('contact.options.email.cta')}
                        </a>
                    </article>

                    <article className="contact__option" ref={(el) => (cardsRef.current[1] = el)}>
                        <FaLinkedin className="contact__option-icon"/>
                        <h4>{t('contact.options.linkedin.title')}</h4>
                        <h5>{t('contact.options.linkedin.value')}</h5>
                        <a href="https://www.linkedin.com/in/julien-esterbet/" target="_blank" rel="noreferrer">
                            {t('contact.options.linkedin.cta')}
                        </a>
                    </article>

                    <article className="contact__option" ref={(el) => (cardsRef.current[2] = el)}>
                        <FaTwitter className="contact__option-icon"/>
                        <h4>{t('contact.options.twitter.title')}</h4>
                        <h5>{t('contact.options.twitter.value')}</h5>
                        <a href="https://twitter.com/JulienEsbtCrypt" target="_blank" rel="noreferrer">
                            {t('contact.options.twitter.cta')}
                        </a>
                    </article>
                </div>

                {/* Form */}
                <form ref={form} onSubmit={sendEmail}>
                    <input
                        type="text"
                        name="name"
                        placeholder={t('contact.form.name')}
                        required
                        ref={(el) => (cardsRef.current[3] = el)}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder={t('contact.form.email')}
                        required
                        ref={(el) => (cardsRef.current[4] = el)}
                    />
                    <textarea
                        name="message"
                        rows="7"
                        placeholder={t('contact.form.message')}
                        required
                        ref={(el) => (cardsRef.current[5] = el)}
                    />
                    <button type="submit" className="btn btn-primary" ref={textRef}>
                        {t('contact.form.submit')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;