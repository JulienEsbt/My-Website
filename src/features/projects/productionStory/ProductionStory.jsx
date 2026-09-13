import React, {useRef} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'
import {FiGrid, FiList, FiSettings} from 'react-icons/fi'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import {HOME_ASSETS} from '../../../config/homeAssets.js'
import './ProductionStory.css'

const stages = [
    ['dashboard', FiGrid],
    ['workshop', FiList],
    ['settings', FiSettings],
]
function StoryStep({item, index, t, reduced}) {
    const root = useRef(null)
    const {scrollYProgress} = useScroll({target: root, offset: ['start end', 'end start']})
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30])
    const [key, Icon] = item
    return (
        <motion.div ref={root} className="production-story__step" style={reduced ? undefined : {y}}>
            <span className="production-story__number">
                <Icon aria-hidden="true" /> 0{index + 1}
            </span>
            <h3>{t(`bruno.solution.items.${key}.title`)}</h3>
            <p>{t(`bruno.solution.items.${key}.body`)}</p>
        </motion.div>
    )
}
export default function ProductionStory({t}) {
    const root = useRef(null)
    const reduced = useReducedMotion()
    const {scrollYProgress} = useScroll({target: root, offset: ['start center', 'end center']})
    const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -3])
    return (
        <div className="production-story" ref={root}>
            <div className="production-story__visual">
                <motion.figure style={reduced ? undefined : {scale, rotateX}}>
                    <ResponsiveImage
                        media={HOME_ASSETS.portfolio.brunoPizza}
                        alt={t('bruno.hero.imageAlt')}
                        sizes="(max-width: 800px) 90vw, 55vw"
                    />
                    <figcaption>{t('bruno.solution.items.dashboard.title')}</figcaption>
                </motion.figure>
                <div className="production-story__track" aria-hidden="true">
                    <motion.span style={{scaleX: reduced ? 1 : scrollYProgress}} />
                </div>
            </div>
            <div className="production-story__steps">
                {stages.map((item, index) => (
                    <StoryStep key={item[0]} item={item} index={index} t={t} reduced={reduced} />
                ))}
            </div>
        </div>
    )
}
