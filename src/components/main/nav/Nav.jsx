import React, {useEffect, useState, useMemo} from 'react'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiMessageSquareDetail} from 'react-icons/bi'
import {RiServiceLine} from 'react-icons/ri'
import './nav.css'

const SECTIONS = ['top', 'about', 'experience', 'services', 'contact']

const Nav = () => {
    const [active, setActive] = useState('#top')

    // Scroll-spy
    useEffect(() => {
        const els = SECTIONS.map(id => document.getElementById(id))
        const obs = new IntersectionObserver(
            (entries) => {
                // on prend la section la plus visible
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
                if (visible?.target?.id) setActive(`#${visible.target.id}`)
            },
            {rootMargin: '0px 0px -55% 0px', threshold: [0.2, 0.4, 0.6, 0.8]}
        )
        els.forEach(el => el && obs.observe(el))
        return () => obs.disconnect()
    }, [])

    const handleClick = (hash) => () => {
        setActive(hash)
        // facultatif: retire le focus du bouton (esthétique)
        // setTimeout(() => document.activeElement?.blur(), 150)
    }

    return (
        <nav className="bnav" role="navigation" aria-label="Section navigation">
            <a
                href="#top"
                onClick={handleClick('#top')}
                className={active === '#top' ? 'active' : ''}
                aria-label="Home"
                data-label="Home"
            >
                <AiOutlineHome/>
            </a>

            <a
                href="#about"
                onClick={handleClick('#about')}
                className={active === '#about' ? 'active' : ''}
                aria-label="About"
                data-label="About"
            >
                <AiOutlineUser/>
            </a>

            <a
                href="#experience"
                onClick={handleClick('#experience')}
                className={active === '#experience' ? 'active' : ''}
                aria-label="Experience"
                data-label="Experience"
            >
                <BiBook/>
            </a>

            <a
                href="#services"
                onClick={handleClick('#services')}
                className={active === '#services' ? 'active' : ''}
                aria-label="Services"
                data-label="Services"
            >
                <RiServiceLine/>
            </a>

            <a
                href="#contact"
                onClick={handleClick('#contact')}
                className={active === '#contact' ? 'active' : ''}
                aria-label="Contact"
                data-label="Contact"
            >
                <BiMessageSquareDetail/>
            </a>
        </nav>
    )
}

export default Nav