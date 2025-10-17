import React, {useLayoutEffect, useRef} from 'react';
import {BsPatchCheckFill} from 'react-icons/bs';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useTranslation} from 'react-i18next';
import './experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
    const {t} = useTranslation('common');

    const sectionRef = useRef(null);
    const detailsRef = useRef([]);

    useLayoutEffect(() => {
        const el = sectionRef.current;
        const details = detailsRef.current.filter(Boolean);

        const ctx = gsap.context(() => {
            gsap.from(el, {
                opacity: 0,
                y: 24,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {trigger: el, start: 'top 80%'},
            });

            gsap.from(details, {
                opacity: 0,
                y: 12,
                duration: 0.4,
                ease: 'power2.out',
                stagger: 0.06,
                scrollTrigger: {trigger: el, start: 'top 70%'},
            });

            details.forEach((node) => {
                node.addEventListener('mouseenter', () =>
                    gsap.to(node, {scale: 1.02, duration: 0.15, ease: 'power1.out'})
                );
                node.addEventListener('mouseleave', () =>
                    gsap.to(node, {scale: 1, duration: 0.2, ease: 'power1.out'})
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // translation map for levels
    const L = {
        exp: t('experience.levels.experienced'),
        int: t('experience.levels.intermediate'),
        beg: t('experience.levels.beginner'),
    };

    // keep the same skills; just change 'level' to a code that we translate via L
    const FRONT = [
        {name: 'React', level: 'exp'},
        {name: 'TypeScript', level: 'exp'},
        {name: 'Tailwind CSS', level: 'exp'},
        {name: 'Angular', level: 'int'},
        {name: 'GSAP / Framer Motion', level: 'exp'},
        {name: 'Web3 client (ethers.js)', level: 'int'},
    ];

    const BACK = [
        {name: 'Java (Spring Boot)', level: 'exp'},
        {name: 'Node.js (scripting, APIs)', level: 'int'},
        {name: 'Python (FastAPI, automation)', level: 'int'},
        {name: 'SQL (MySQL)', level: 'int'},
        {name: 'Solidity (smart contracts)', level: 'int'},
        {name: 'Blockchain integration (Hardhat / APIs)', level: 'int'},
    ];

    const setDetailRef = (el, idx) => (detailsRef.current[idx] = el);

    return (
        <section id="experience" ref={sectionRef}>
            <h5>{t('experience.kicker')}</h5>
            <h2>{t('experience.title')}</h2>

            <div className="container experience__container">
                {/* FRONTEND */}
                <div className="experience__frontend">
                    <h3>{t('experience.groups.frontend')}</h3>
                    <div className="experience__content">
                        {FRONT.map((s, i) => (
                            <article
                                className="experience__details"
                                key={`fe-${s.name}`}
                                ref={(el) => setDetailRef(el, i)}
                            >
                                <BsPatchCheckFill className="experience__details-icon"/>
                                <div>
                                    <h4>{s.name}</h4>
                                    <small className="text-light">{L[s.level]}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* BACKEND */}
                <div className="experience__backend">
                    <h3>{t('experience.groups.backend')}</h3>
                    <div className="experience__content">
                        {BACK.map((s, i) => (
                            <article
                                className="experience__details"
                                key={`be-${s.name}`}
                                ref={(el) => setDetailRef(el, FRONT.length + i)}
                            >
                                <BsPatchCheckFill className="experience__details-icon"/>
                                <div>
                                    <h4>{s.name}</h4>
                                    <small className="text-light">{L[s.level]}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;