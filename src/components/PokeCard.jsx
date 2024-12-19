import { useEffect, useState } from "react"
import { getPokedexNumber, getFullPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from "./Modal"
import AnimatedSprite from "./AnimatedSprite"

export default function PokeCard(props) {

    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    // prevent the user from doubling up loading the skill
    const [loadingSkill, setLoadingSkill] = useState(false)

    const { name, height, abilities, stats, types, moves, sprites } = data || {}

    const imgList = Object.keys(sprites || {}).filter((val) => {
        if (!sprites[val]) {
            return false
        }
        if (['versions', 'other'].includes(val)) {
            return false
        }
        return true
    }).sort((a, b) => {
        const aHasFront = a.toLowerCase().includes('front');
        const bHasFront = b.toLowerCase().includes('front');
        return bHasFront - aHasFront; // Sort so 'front' appears first
    });

    // for fetching moveData
    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }
        // check cache for move
        let skillCache = {}
        if (localStorage.getItem('pokemon-moves')) {
            skillCache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in skillCache) {
            setSkill(skillCache[move])
            console.log('Found move in skillCache');
            return

        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData);
            const description = moveData?.flavor_text_entries?.filter((val) => {
                return val.version_group.name = 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }

            setSkill(skillData)
            skillCache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(skillCache))


        } catch (err) {
            console.log(err.message);

        } finally {
            setLoadingSkill(false)
        }

    }

    useEffect(() => {
        //if loading exist loop
        if (loading || !localStorage) { return }

        //check if the selected pokemon is available in the cache

        //1. Define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        //2. is the selectedPokemon is in the cache ortherwise fetch it from API
        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache');

            return
        }

        // no cache is available so fetch from API

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const response = await fetch(finalUrl)
                const pokemonData = await response.json()
                setData(pokemonData)
                console.log(pokemonData);

                //3. if we fetch from API make sure save that information to cache for next time(prevent us from ban from rateLimiting)
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message);

            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }
    return (
        <div className="poke-card">
            {/* conditional rendering */}
            {skill && (<Modal handleCloseModal={() => {
                // closes the modal
                setSkill(null)
            }} >
                <div>
                    <h6>
                        Name
                    </h6>
                    <h2 className="skill-name">
                        {skill.name.replaceAll('-', ' ')}
                    </h2>
                </div>
                <div>
                    <h6>
                        Description
                    </h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} className="default-img" alt={`${name}-large-img`} />
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {

                    const imgUrl = sprites[spriteUrl]

                    return (
                        <AnimatedSprite sprites={sprites} key={`sprite-${spriteIndex}`}/>
                    )
                })}
            </div>
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
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className="buton-card pokemon-move" key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}