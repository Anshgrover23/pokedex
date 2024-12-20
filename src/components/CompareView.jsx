import { useEffect, useState } from "react"
import { getPokedexNumber, getFullPokedexNumber, first151Pokemon } from '../utils'
import TypeCard from './TypeCard'

export default function CompareView() {
    const [pokemon1, setPokemon1] = useState(null)
    const [pokemon2, setPokemon2] = useState(null)
    const [pokemon1Data, setPokemon1Data] = useState(null)
    const [pokemon2Data, setPokemon2Data] = useState(null)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    // Reuse the same caching logic from PokeCard
    async function fetchPokemonData(pokemonIndex, setData, setLoading) {
        if (!localStorage) return

        // Check cache first
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        if (pokemonIndex in cache) {
            setData(cache[pokemonIndex])
            console.log('Found pokemon in cache')
            return
        }

        // Fetch if not in cache
        setLoading(true)
        try {
            const baseUrl = 'https://pokeapi.co/api/v2/'
            const suffix = 'pokemon/' + getPokedexNumber(pokemonIndex)
            const finalUrl = baseUrl + suffix
            const response = await fetch(finalUrl)
            const pokemonData = await response.json()
            setData(pokemonData)

            // Update cache
            cache[pokemonIndex] = pokemonData
            localStorage.setItem('pokedex', JSON.stringify(cache))
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (pokemon1 !== null) {
            fetchPokemonData(pokemon1, setPokemon1Data, setLoading1)
        }
    }, [pokemon1])

    useEffect(() => {
        if (pokemon2 !== null) {
            fetchPokemonData(pokemon2, setPokemon2Data, setLoading2)
        }
    }, [pokemon2])

    function PokemonCompareCard({ pokemonData, selectedPokemon, loading }) {
        if (loading || !pokemonData) {
            return (
                <div className="poke-card">
                    <h4>Loading...</h4>
                </div>
            )
        }

        if (!selectedPokemon) {
            return (
                <div className="poke-card">
                    <h4>Select a Pokémon</h4>
                </div>
            )
        }

        const { name, stats, types } = pokemonData

        return (
            <div className="poke-card">
                <div>
                    <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                    <h2>{name}</h2>
                </div>
                <div className="type-container">
                    {types.map((typeObj, typeIndex) => (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    ))}
                </div>
                <img
                    src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'}
                    className="default-img"
                    alt={`${name}-large-img`}
                />
                <h3>Stats</h3>
                <div className="stats-card">
                    {stats.map((statObj, statIndex) => {
                        const { stat, base_stat } = statObj
                        return (
                            <div key={statIndex} className="stat-item">
                                <p>{stat?.name?.replaceAll('-', ' ')}</p>
                                <h4>{base_stat}</h4>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="compare-container">
            <div className="compare-selectors">
                <select
                    value={pokemon1 ?? ''}
                    onChange={(e) => setPokemon1(e.target.value ? Number(e.target.value) : null)}
                >
                    <option value="">Select first Pokémon</option>
                    {first151Pokemon.map((name, index) => (
                        <option key={index} value={index}>
                            {getFullPokedexNumber(index)} - {name}
                        </option>
                    ))}
                </select>

                <select
                    value={pokemon2 ?? ''}
                    onChange={(e) => setPokemon2(e.target.value ? Number(e.target.value) : null)}
                >
                    <option value="">Select second Pokémon</option>
                    {first151Pokemon.map((name, index) => (
                        <option key={index} value={index}>
                            {getFullPokedexNumber(index)} - {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="compare-cards">
                <PokemonCompareCard
                    pokemonData={pokemon1Data}
                    selectedPokemon={pokemon1}
                    loading={loading1}
                />
                <PokemonCompareCard
                    pokemonData={pokemon2Data}
                    selectedPokemon={pokemon2}
                    loading={loading2}
                />
            </div>
        </div>
    )
}