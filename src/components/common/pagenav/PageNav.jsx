import React, {useState} from 'react'
import './pagenav.css'
import { Spin as Hamburger } from 'hamburger-react'
import { Link } from 'react-router-dom'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)
    return (
    <div className='pagenav'>
        <div className="pagenavbar">
            <div className="navbutton">
                <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
            {isOpen ? (
            <div className="pagebar">
                <Link to="/" className='pagetext'>Home</Link>
                <Link to="/crypto" className='pagetext'>Crypto</Link>
            </div>
            ) : null}
        </div>
    </div>
  )
}

export default PageNav