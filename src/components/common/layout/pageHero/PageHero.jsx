import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'
import './PageHero.css'

const PageHero = ({id, kicker, title, subtitle, children, visual, footer, fullScreen = false}) => {
    const reducedMotion = useReducedMotion()
    return (
        <section
            id={id}
            className={`page-hero${fullScreen ? ' entry-screen editorial-entry' : ''}`}
        >
            <motion.div
                className="container page-hero__container"
                initial={reducedMotion ? false : {opacity: 0, y: 28}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: reducedMotion ? 0 : 0.7, ease: 'easeOut'}}
            >
                <div className="page-hero__copy">
                    <p className="page-hero__kicker">{kicker}</p>
                    <h1>{title}</h1>
                    <p className="page-hero__subtitle">{subtitle}</p>
                    {children && <div className="page-hero__actions">{children}</div>}
                </div>
                {visual && <div className="page-hero__visual">{visual}</div>}
                {footer && <div className="page-hero__footer">{footer}</div>}
            </motion.div>
        </section>
    )
}

export default PageHero
