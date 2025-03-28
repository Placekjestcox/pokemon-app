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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [filters, setFilters] = useState({
    hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0,
  });

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
    setActiveButton("next");
    const nextId = parseInt(id, 10) + 1;
    if (nextId <= 1000) {
      navigate(`/pokemon/${nextId}`);
    }
  };

  const goToPrevPokemon = () => {
    setActiveButton("prev");
    const prevId = parseInt(id, 10) - 1;
    if (prevId >= 1) {
      navigate(`/pokemon/${prevId}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.min(value, 255);
    setFilters({
      ...filters,
      [name]: newValue, 
    });
  };

  const fetchAllPokemons = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
      return response.data.results;
    } catch (error) {
      console.error("Error fetching all Pokémon:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    try {
      const allPokemons = await fetchAllPokemons();
  
      let filteredPokemon = null;
      for (const pokemon of allPokemons) {
        const pokemonDetail = await axios.get(pokemon.url);
        const isMatch = pokemonDetail.data.stats.every((stat, index) => {
          const statValue = stat.base_stat;
          switch (index) {
            case 0:
              return statValue === parseInt(filters.hp) || filters.hp === 0;
            case 1:
              return statValue === parseInt(filters.attack) || filters.attack === 0;
            case 2:
              return statValue === parseInt(filters.defense) || filters.defense === 0;
            case 3:
              return statValue === parseInt(filters.specialAttack) || filters.specialAttack === 0;
            case 4:
              return statValue === parseInt(filters.specialDefense) || filters.specialDefense === 0;
            case 5:
              return statValue === parseInt(filters.speed) || filters.speed === 0;
            default:
              return false;
          }
        });
        if (isMatch) {
          filteredPokemon = pokemonDetail.data;
          break;}}
      if (filteredPokemon) {
        navigate(`/pokemon/${filteredPokemon.id}`);
      } else {
        alert("No Pokémon found with these stats.");
      }
      setIsSidebarOpen(false); 
    } catch (error) {
      console.error("Error while searching for Pokémon:", error);
      alert("An error occurred while searching for Pokémon.");
    }
  };
  

  return (
    <div className="web">
      <div className="buttons">
        <div className="extra-button">
          <button onClick={() => navigate("/")}>Back to Pokedex</button>
        </div>
        <div className="buttons-container">
          <button id="Prevv" onClick={goToPrevPokemon} disabled={parseInt(id, 10) <= 1} className={activeButton === "prev" ? "active-button" : ""}>&lt; Prev</button>
          <button id="Nextt" onClick={goToNextPokemon} disabled={parseInt(id, 10) >= 1000} className={activeButton === "next" ? "active-button" : ""}> Next &gt;</button>
        </div>
      </div>
      <div className="pokemon">
        <div className="photo">
          {pokemon && (
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} alt={pokemon.name}/>
          )}
        </div>
        <div className="name">
          <p id="pokemon-id">
            #{pokemon ? pokemon.id.toString().padStart(3, "0") : ""}
          </p>
          <p id="pokemon-name">
            {pokemon
              ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1): "Loading..."}
          </p>
        </div>
      </div>
      <div className="Description">
        <p id="Desc">Description</p>
        {pokemon ? <p>{pokemon.description}</p> : <p>Loading...</p>}
      </div>
      <div className={`filter ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleSidebar}>X</button>
        <p>Filters Pokemon:</p>
        <div>
          <label>HP:</label>
          <input type="number" name="hp" min="0" max="255" value={filters.hp} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Attack: </label>
          <input type="number" name="attack" min="0" max="255" value={filters.attack} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Defense: </label>
          <input type="number" name="defense" min="0" max="255" value={filters.defense} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Special Attack: </label>
          <input type="number" name="specialAttack" min="0" max="255" value={filters.specialAttack} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Special Defense: </label>
          <input type="number" name="specialDefense" min="0" max="255" value={filters.specialDefense} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Speed: </label>
          <input type="number" name="speed" min="0" max="255" value={filters.speed} onChange={handleFilterChange} />
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      {!isSidebarOpen && (
        <div className="filter-button-div">
          <button className="filter-button" onClick={toggleSidebar}>Filter</button>
        </div>
      )}
      <PhysicalAttributes pokemon={pokemon} />
      <BaseStats pokemon={pokemon} />
      <EvolutionChain pokemonId={pokemon ? pokemon.id : null} />
      <Moves pokemon={pokemon} />
    </div>
    
  );
};

export default PokemonDetail;
