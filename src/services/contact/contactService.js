import {CONTACT_PROVIDER_CONFIG} from '../../config/contact.js'

export async function sendContactForm(form) {
    const {default: emailjs} = await import('emailjs-com')
    const {serviceId, templateId, publicKey} = CONTACT_PROVIDER_CONFIG

    return emailjs.sendForm(serviceId, templateId, form, publicKey)
}
