import React, {useEffect, useState} from 'react'
import './nav.css'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'
import {BiBook, BiDonateHeart} from 'react-icons/bi'
import {RiServiceLine} from 'react-icons/ri'

const SECTIONS = ['top', 'about', 'knowledge', 'tools', 'donation']

const Nav = () => {
    const [active, setActive] = useState('#top')

    // Scroll-spy (même logique que Main)
    useEffect(() => {
        const els = SECTIONS.map(id => document.getElementById(id))
        const obs = new IntersectionObserver(
            entries => {
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

    const handleClick = hash => () => setActive(hash)

    return (
        <nav className="bnav" role="navigation" aria-label="Crypto section navigation">
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
                href="#knowledge"
                onClick={handleClick('#knowledge')}
                className={active === '#knowledge' ? 'active' : ''}
                aria-label="Knowledge"
                data-label="Knowledge"
            >
                <BiBook/>
            </a>

            <a
                href="#tools"
                onClick={handleClick('#tools')}
                className={active === '#tools' ? 'active' : ''}
                aria-label="Tools"
                data-label="Tools"
            >
                <RiServiceLine/>
            </a>

            <a
                href="#donation"
                onClick={handleClick('#donation')}
                className={active === '#donation' ? 'active' : ''}
                aria-label="Donation"
                data-label="Donation"
            >
                <BiDonateHeart/>
            </a>
        </nav>
    )
}

export default Nav