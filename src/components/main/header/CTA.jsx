import React from 'react'
import {motion} from 'framer-motion'
import CV from '../../../assets/main/cv.pdf'

const Btn = ({href, children, ...props}) => (
    <motion.a
        href={href}
        whileHover={{y: -2}}
        whileTap={{scale: 0.98}}
        className="btn"
        {...props}
    >
        {children}
    </motion.a>
)

const CTA = () => {
    return (
        <div className="cta" role="group" aria-label="Primary actions">
            <Btn href={CV} target="_blank" rel="noreferrer">Open CV</Btn>
            <Btn href={CV} download>Download CV</Btn>
            <Btn href="#contact" className="btn btn-primary">Let’s talk</Btn>
        </div>
    )
}

export default CTA