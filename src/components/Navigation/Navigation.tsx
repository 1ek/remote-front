import { Link } from "@tanstack/react-router"
import './Navigation.scss'
const Navigation = () => {

    return (
        <nav className="nav">
            <Link to="/">Home</Link> 
            <Link to="/config">Config</Link>
        </nav>
    )
}

export default Navigation