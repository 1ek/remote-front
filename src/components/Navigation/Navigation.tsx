import { Link } from "@tanstack/react-router"
import './Navigation.scss'
const Navigation = () => {

    return (
        <nav className="nav">
            <Link className='nav_link' to="/">Home</Link> 
            <Link className='nav_link' to="/config">Config</Link>
        </nav>
    )
}

export default Navigation