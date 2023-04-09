import { Link } from "@tanstack/react-router"
import './Navigation.scss'
const NavLinks = () => {

    return (
        <div className="nav_links">
            <Link className='nav_link' to="/">Home</Link> 
            <Link className='nav_link' to="/config">Config</Link>
        </div>
    )
}

export default NavLinks