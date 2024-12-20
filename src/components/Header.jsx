import { Link } from 'react-router-dom'

export default function Header(props) {
    const { handleToggleMenu } = props
    return (
        <header>
            <button onClick={handleToggleMenu} className="open-nav-button">
                <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-gradient">Pokédox</h1>
            <Link to="/compare" className="nav-card">
                <p>Compare Pokémon</p>
            </Link>
        </header>
    )
}