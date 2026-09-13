import {mkdir} from 'node:fs/promises'
import {join} from 'node:path'
import sharp from 'sharp'
import trips from '../src/data/travel/trips.js'

const escapeXml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')

for (const language of ['fr', 'en']) {
    const outputDirectory = join('dist', 'og', 'travel', language)
    await mkdir(outputDirectory, {recursive: true})

    for (const trip of trips) {
        const city = language === 'fr' ? trip.city : (trip.cityEn ?? trip.city)
        const country = language === 'fr' ? trip.country : (trip.countryEn ?? trip.country)
        const date = language === 'fr' ? trip.dateLabel : (trip.dateLabelEn ?? trip.dateLabel)
        const label = language === 'fr' ? 'Carnet de voyage' : 'Travel journal'
        const svg = `
            <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#071329" />
                        <stop offset="1" stop-color="#102b52" />
                    </linearGradient>
                    <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(980 80) rotate(135) scale(520 420)">
                        <stop stop-color="#55d6be" stop-opacity="0.36" />
                        <stop offset="1" stop-color="#55d6be" stop-opacity="0" />
                    </radialGradient>
                </defs>
                <rect width="1200" height="630" fill="url(#background)" />
                <rect width="1200" height="630" fill="url(#glow)" />
                <circle cx="1020" cy="225" r="136" fill="none" stroke="#55d6be" stroke-opacity="0.45" stroke-width="2" />
                <circle cx="1020" cy="225" r="94" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2" />
                <circle cx="1020" cy="225" r="12" fill="#55d6be" />
                <path d="M884 225h272M1020 89c-54 46-80 92-80 136s26 90 80 136M1020 89c54 46 80 92 80 136s-26 90-80 136" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2" />
                <text x="88" y="100" fill="#55d6be" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="4">${escapeXml(label.toUpperCase())}</text>
                <text x="88" y="268" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700">${escapeXml(city)}</text>
                <text x="88" y="340" fill="#d6e5f5" font-family="Arial, Helvetica, sans-serif" font-size="40">${escapeXml(country)}</text>
                <text x="88" y="430" fill="#8ca8c6" font-family="Arial, Helvetica, sans-serif" font-size="30">${escapeXml(date)}</text>
                <line x1="88" y1="515" x2="1112" y2="515" stroke="#ffffff" stroke-opacity="0.16" />
                <text x="88" y="570" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">Julien Esterbet</text>
                <text x="1112" y="570" text-anchor="end" fill="#8ca8c6" font-family="Arial, Helvetica, sans-serif" font-size="22">julienesterbet.com</text>
            </svg>`

        await sharp(Buffer.from(svg))
            .png()
            .toFile(join(outputDirectory, `${trip.id}.png`))
    }
}

console.log(`Generated ${trips.length * 2} localized travel social images.`)
