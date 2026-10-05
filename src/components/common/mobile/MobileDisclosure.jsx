import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import useMediaQuery from '../accessibility/useMediaQuery.js'

export default function MobileDisclosure({children, label, id, summaryClassName}) {
    const mobile = useMediaQuery('(max-width: 700px)')
    const [open, setOpen] = useState(false)
    const {hash} = useLocation()
    useEffect(() => {
        if (mobile && hash === `#${id}`) setOpen(true)
    }, [mobile, hash, id])
    if (!mobile) return <>{children}</>
    return (
        <details
            id={id}
            open={open}
            className="container mobile-disclosure"
            onToggle={(event) => setOpen(event.currentTarget.open)}
        >
            <summary className={summaryClassName}>{label}</summary>
            {open && children}
        </details>
    )
}
