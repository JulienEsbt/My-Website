import React from 'react'
import {PassThrough} from 'node:stream'
import {renderToPipeableStream} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {MotionConfig} from 'framer-motion'
import i18n, {loadNamespaces} from './i18n/i18n.js'
import {languageFromPath} from './config/localizedPaths.js'
import Router from './app/router.jsx'

export async function renderPage(pathname) {
    const language = languageFromPath(pathname)
    await loadNamespaces(['home', 'projects', 'resume', 'web3', 'travel', 'reflections'])
    await i18n.changeLanguage(language)
    return new Promise((resolve, reject) => {
        const output = new PassThrough()
        const chunks = []
        let error
        output.on('data', (chunk) => chunks.push(chunk))
        output.on('error', reject)
        output.on('end', () => {
            clearTimeout(timeout)
            if (error) reject(error)
            else resolve(Buffer.concat(chunks).toString('utf8'))
        })
        const stream = renderToPipeableStream(
            <MotionConfig reducedMotion="always">
                <StaticRouter location={pathname}>
                    <Router />
                </StaticRouter>
            </MotionConfig>,
            {
                onAllReady() {
                    stream.pipe(output)
                },
                onError(cause) {
                    error = cause
                },
                onShellError(cause) {
                    clearTimeout(timeout)
                    reject(cause)
                },
            }
        )
        const timeout = setTimeout(() => {
            stream.abort()
            reject(new Error(`Prerender timeout: ${pathname}`))
        }, 30000)
    })
}
