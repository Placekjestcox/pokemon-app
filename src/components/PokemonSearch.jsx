import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PokemonSearch = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${(page - 1) * 12}`);
      setPokemonList(response.data.results);
    };
    fetchPokemons();
  }, [page]);

  const formatPokemonId = (id) => {
    return `#${String(id).padStart(3, '0')}`;
  };

  const toggleFavorite = (pokemon) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(pokemon)
        ? prevFavorites.filter((fav) => fav !== pokemon)
        : [...prevFavorites, pokemon]
    );
  };

  const displayedPokemons = showFavorites ? favorites : pokemonList;

  return (
    <div className="pokemon-search">
<nav className="navbar">
  <button 
    onClick={() => setShowFavorites(false)} 
    className={`nav-button ${!showFavorites ? "active" : ""}`}
  >
    Home
  </button>
  <button 
    onClick={() => setShowFavorites(true)} 
    className={`nav-button ${showFavorites ? "active" : ""}`}
  >
    Lista ulubionych
  </button>
</nav>

      <div className="pokemon-grid">
        {displayedPokemons.map((pokemon, index) => {
          const pokemonId = pokemon.url ? pokemon.url.split('/')[6] : pokemon.id;
          const isFavorite = favorites.includes(pokemon);
          return (
            <div className="pokemonitem" key={index}>
              <div className="top">
                <p className="pokemon-id">{formatPokemonId(pokemonId)}</p>
                <Link to={`/pokemon/${pokemonId}`}>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                    alt={pokemon.name}
                  />
                </Link>
              </div>
              <div className="bottom">
                <p id="pokemonname">{pokemon.name}</p>
                <button onClick={() => toggleFavorite(pokemon)} className="favorite-button">
    {isFavorite ? '❤️' : '🤍'}
  </button>
              </div>
            </div>
          );
        })}
      </div>

      {!showFavorites && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} id="Previous" disabled={page === 1}>
            Previous
          </button>
          <button onClick={() => setPage(page + 1)} id="Next">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;
