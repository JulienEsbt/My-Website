import React from 'react'
import {motion} from 'framer-motion'
import './PageHero.css'

const PageHero = ({kicker, title, subtitle, children}) => {
    return (
        <section className="page-hero">
            <motion.div
                className="container page-hero__container"
                initial={{opacity: 0, y: 28}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.7, ease: 'easeOut'}}
            >
                <p className="page-hero__kicker">{kicker}</p>
                <h1>{title}</h1>
                <p className="page-hero__subtitle">{subtitle}</p>
                {children && <div className="page-hero__actions">{children}</div>}
            </motion.div>
        </section>
    )
}

export default PageHero