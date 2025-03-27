import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PokemonDetail.css";
import PhysicalAttributes from "./INFOcomponents/PhysicalAttributes";
import BaseStats from "./INFOcomponents/BaseStats";
import EvolutionChain from "./INFOcomponents/EvolutionChain";
import Moves from "./INFOcomponents/Moves";
import "../components/Responsive.css";



const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [activeButton, setActiveButton] = useState(null); 

  useEffect(() => {
    const pokemonId = parseInt(id, 10);
    if (pokemonId < 1 || pokemonId > 1000 || isNaN(pokemonId)) {
      navigate("/");
    } else {
      const fetchPokemonDetails = async () => {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          setPokemon({
            ...response.data,
            description: speciesResponse.data.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
            )?.flavor_text || "No description available."            
          });
        } catch (error) {
          console.error("Pokemon details not found!", error);
          setPokemon(null);
        }
      };

      fetchPokemonDetails();
    }
  }, [id, navigate]);

  const goToNextPokemon = () => {
    setActiveButton('next'); 
    const nextId = parseInt(id, 10) + 1;
    if (nextId <= 1000) { navigate(`/pokemon/${nextId}`); }
  };

  const goToPrevPokemon = () => {
    setActiveButton('prev'); 
    const prevId = parseInt(id, 10) - 1;
    if (prevId >= 1) { navigate(`/pokemon/${prevId}`); }
  };

  return (
    <div className="web">
      <div className="buttons">
        <div className="extra-button">
          <button onClick={() => navigate("/")}>Back to Pokedex</button>
        </div>
        <div className="buttons-container">
          <button id='Prevv'
            onClick={goToPrevPokemon}
            disabled={parseInt(id, 10) <= 1}
            className={activeButton === 'prev' ? 'active-button' : ''}
          >
            &lt; Prev
          </button>

          <button id='Nextt'
            onClick={goToNextPokemon}
            disabled={parseInt(id, 10) >= 1000}
            className={activeButton === 'next' ? 'active-button' : ''}
          >
            Next &gt; 
          </button>

        </div>
      </div>
      <div className="pokemon">
        <div className="photo">
          {pokemon && (
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
            />
          )}
        </div>
        <div className="name">
          <p id="pokemon-id">
            #{pokemon ? pokemon.id.toString().padStart(3, "0") : ""}
          </p>

          <p id="pokemon-name">
            {pokemon ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : "Loading..."}
          </p>
        </div>
      </div>
      <div className="Description">
        <p id="Desc">Description</p>
        {pokemon ? <p>{pokemon.description}</p> : <p>Loading...</p>}
      </div>
      <PhysicalAttributes pokemon={pokemon} />
      <BaseStats pokemon={pokemon} />
      <EvolutionChain pokemonId={pokemon ? pokemon.id : null} />
      <Moves pokemon={pokemon} />
    </div>
  );
};

export default PokemonDetail;
