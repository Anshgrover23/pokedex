import { first151Pokemon, getFullPokedexNumber } from '../utils'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SideNav(props) {
    const { selectedPokemon, setSelectedPokemon, showSideMenu, handleCloseMenu } = props
    const [searchValue, setSearchValue] = useState('')

    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        //if full pokedex number provided return true
        if ((getFullPokedexNumber(eleIndex)).includes(searchValue)) {
            return true
        }
        //if the pokemon name provided return true
        if(ele.toLowerCase().includes(searchValue.toLowerCase())) {
            return true
        }
        //otherwise, exclude value from the array
        return false
    })

    return (
        <nav className={' ' + (!showSideMenu ? 'open' : '')}>
            <div className={'Header ' + (!showSideMenu ? 'open' : '')}>
                <button onClick={ handleCloseMenu } className='open-nav-button'>
                <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className='text-gradient'>Pokédex</h1>
                <Link to="/compare" className="nav-card">
                    <p>Compare Pokémon</p>
                </Link>
            </div>
            <input  placeholder='001 or Bulb...' value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)
                console.log(e.target.value);

            }} />
            {
                filteredPokemon.map((pokemon, pokemonIndex) => {
                    return (
                        <button onClick={() => {
                            setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                            handleCloseMenu()
                        }} key={pokemonIndex} className={'nav-card ' +
                            (pokemonIndex === selectedPokemon ? 'nav-card-selected' : '')
                        }>
                            <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                            <p>{pokemon}</p>
                        </button>
                    )
                })
            }
        </nav>
    )
}