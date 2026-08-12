import React, {useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {MdOutlineEmail} from 'react-icons/md'
import {FaLinkedin, FaTwitter} from 'react-icons/fa'
import {FiArrowUpRight, FiSend} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import {LINKS} from '../../../../config/links.js'
import {sendContactForm} from '../../../../services/contact/contactService.js'
import './ContactSection.css'

const ContactSection = () => {
    const {t} = useTranslation('common')
    const form = useRef(null)

    const [status, setStatus] = useState(null)
    const [formStartedAt, setFormStartedAt] = useState(() => Date.now())

    const emailValue = t('contact.options.email.value')
    const mailtoHref = `mailto:${emailValue}`

    const options = [
        {
            id: 'email',
            icon: <MdOutlineEmail />,
            title: t('contact.options.email.title'),
            value: emailValue,
            href: mailtoHref,
            cta: t('contact.options.email.cta'),
        },
        {
            id: 'linkedin',
            icon: <FaLinkedin />,
            title: t('contact.options.linkedin.title'),
            value: t('contact.options.linkedin.value'),
            href: LINKS.social.linkedin,
            cta: t('contact.options.linkedin.cta'),
        },
        {
            id: 'twitter',
            icon: <FaTwitter />,
            title: t('contact.options.twitter.title'),
            value: t('contact.options.twitter.value'),
            href: LINKS.social.twitter,
            cta: t('contact.options.twitter.cta'),
        },
    ]

    const sendEmail = async (event) => {
        event.preventDefault()
        const formElement = event.currentTarget
        setStatus('loading')

        try {
            await sendContactForm(formElement)

            setStatus('success')
            formElement.reset()
            setFormStartedAt(Date.now())
        } catch {
            setStatus('error')
        }
    }

    return (
        <section id="contact">
            <p className="section-kicker">{t('contact.kicker')}</p>
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
                                <span className="crypto-contact__option-icon">{option.icon}</span>

                                <div>
                                    <strong>{option.title}</strong>
                                    <small>{option.value}</small>
                                </div>

                                <em>
                                    {option.cta}
                                    <FiArrowUpRight />
                                </em>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <motion.form
                    ref={form}
                    className="crypto-contact__form"
                    onSubmit={sendEmail}
                    aria-busy={status === 'loading'}
                    initial={{opacity: 0, x: 32}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.55, delay: 0.08}}
                >
                    <div className="crypto-contact__honeypot" aria-hidden="true">
                        <label htmlFor="contact-website">Site web</label>
                        <input
                            id="contact-website"
                            type="text"
                            name="website"
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>

                    <input type="hidden" name="startedAt" value={formStartedAt} />

                    <div className="crypto-contact__field">
                        <label htmlFor="contact-name">{t('contact.form.nameLabel')}</label>
                        <input
                            id="contact-name"
                            type="text"
                            name="name"
                            autoComplete="name"
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
                            autoComplete="email"
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                        aria-describedby="contact-form-status"
                    >
                        <FiSend />
                        {status === 'loading'
                            ? t('contact.form.sending')
                            : t('contact.form.submit')}
                    </button>

                    {status && (
                        <p
                            id="contact-form-status"
                            className={`crypto-contact__status ${status}`}
                            role={status === 'error' ? 'alert' : 'status'}
                            aria-live={status === 'error' ? 'assertive' : 'polite'}
                            aria-atomic="true"
                        >
                            {t(`contact.form.${status}`)}
                        </p>
                    )}
                </motion.form>
            </div>
        </section>
    )
}

export default ContactSection
