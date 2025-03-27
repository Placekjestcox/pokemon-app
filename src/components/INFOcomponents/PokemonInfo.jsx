import React from 'react';

const PokemonInfo = ({ pokemon }) => {
  return (
    <div className="pokemon">
      <div className="photo">
        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} alt={pokemon.name} className="pokemon-img"/></div>
      <div className="name">
        <b>{pokemon.name}</b>
        <span> #{pokemon.id}</span>

       
      </div>
    </div>
  );
};

export default PokemonInfo;
