import React, {useRef, useState} from 'react'
import emailjs from 'emailjs-com'
import {motion} from 'framer-motion'
import {MdOutlineEmail} from 'react-icons/md'
import {FaLinkedin, FaTwitter} from 'react-icons/fa'
import {FiArrowUpRight, FiSend} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {LINKS} from "../../../config/links.js";
import './contactSection.css'

const ContactSection = () => {
    const {t} = useTranslation('common')
    const form = useRef(null)

    const [status, setStatus] = useState(null)

    const emailValue = t('contact.options.email.value')
    const mailtoHref = `mailto:${emailValue}`

    const options = [
        {
            id: 'email',
            icon: <MdOutlineEmail/>,
            title: t('contact.options.email.title'),
            value: emailValue,
            href: mailtoHref,
            cta: t('contact.options.email.cta'),
        },
        {
            id: 'linkedin',
            icon: <FaLinkedin/>,
            title: t('contact.options.linkedin.title'),
            value: t('contact.options.linkedin.value'),
            href: LINKS.social.linkedin,
            cta: t('contact.options.linkedin.cta'),
        },
        {
            id: 'twitter',
            icon: <FaTwitter/>,
            title: t('contact.options.twitter.title'),
            value: t('contact.options.twitter.value'),
            href: LINKS.social.twitter,
            cta: t('contact.options.twitter.cta'),
        },
    ]

    const sendEmail = async (event) => {
        event.preventDefault()
        setStatus('loading')

        try {
            await emailjs.sendForm(
                'service_me0jfjg',
                'template_mwmosps',
                form.current,
                'QgbIYSLquY8PrqQho'
            )

            setStatus('success')
            event.target.reset()
        } catch {
            setStatus('error')
        }
    }

    return (
        <section id="contact">
            <h5>{t('contact.kicker')}</h5>
            <h2>{t('contact.title')}</h2>

            <div className="container crypto-contact">
                <motion.div
                    className="crypto-contact__left"
                    initial={{opacity: 0, x: -32}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.55}}
                >
                    <div className="crypto-contact__intro">
                        <span>{t('contact.badge')}</span>
                        <h3>{t('contact.heading')}</h3>
                        <p>{t('contact.description')}</p>
                    </div>

                    <div className="crypto-contact__options">
                        {options.map((option, index) => (
                            <motion.a
                                key={option.id}
                                href={option.href}
                                target="_blank"
                                rel="noreferrer"
                                className="crypto-contact__option"
                                initial={{opacity: 0, y: 22}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.4, delay: index * 0.08}}
                            >
                                <span className="crypto-contact__option-icon">
                                    {option.icon}
                                </span>

                                <div>
                                    <strong>{option.title}</strong>
                                    <small>{option.value}</small>
                                </div>

                                <em>
                                    {option.cta}
                                    <FiArrowUpRight/>
                                </em>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <motion.form
                    ref={form}
                    className="crypto-contact__form"
                    onSubmit={sendEmail}
                    initial={{opacity: 0, x: 32}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.55, delay: 0.08}}
                >
                    <div className="crypto-contact__field">
                        <label htmlFor="contact-name">{t('contact.form.nameLabel')}</label>
                        <input
                            id="contact-name"
                            type="text"
                            name="name"
                            placeholder={t('contact.form.name')}
                            required
                        />
                    </div>

                    <div className="crypto-contact__field">
                        <label htmlFor="contact-email">{t('contact.form.emailLabel')}</label>
                        <input
                            id="contact-email"
                            type="email"
                            name="email"
                            placeholder={t('contact.form.email')}
                            required
                        />
                    </div>

                    <div className="crypto-contact__field">
                        <label htmlFor="contact-message">{t('contact.form.messageLabel')}</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            rows="7"
                            placeholder={t('contact.form.message')}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                        <FiSend/>
                        {status === 'loading'
                            ? t('contact.form.sending')
                            : t('contact.form.submit')}
                    </button>

                    {status === 'success' && (
                        <p className="crypto-contact__status success">
                            {t('contact.form.success')}
                        </p>
                    )}

                    {status === 'error' && (
                        <p className="crypto-contact__status error">
                            {t('contact.form.error')}
                        </p>
                    )}
                </motion.form>
            </div>
        </section>
    )
}

export default ContactSection