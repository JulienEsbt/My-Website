import {Children, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import {FiPlus} from 'react-icons/fi'
import useMediaQuery from '../accessibility/useMediaQuery.js'

export default function MobileAccordion({children, labels}) {
    const mobile = useMediaQuery('(max-width: 700px)')
    const root = useRef(null)
    const {hash} = useLocation()
    useEffect(() => {
        if (!mobile || !hash) return
        const target = document.getElementById(hash.slice(1))
        if (!root.current?.contains(target)) return
        const details = target.closest('.mobile-accordion__item')
        if (details) details.open = true
    }, [mobile, hash])
    if (!mobile) return <>{children}</>
    return (
        <div className="mobile-accordion" ref={root}>
            {Children.toArray(children).map((child, index) => (
                <details className="mobile-accordion__item" key={child.key ?? index}>
                    <summary>
                        <span className="mobile-accordion__number" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{labels[index]}</span>
                        <FiPlus aria-hidden="true" />
                    </summary>
                    <div className="mobile-accordion__body">{child}</div>
                </details>
            ))}
        </div>
    )
}
