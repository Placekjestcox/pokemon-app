import React from 'react';
import "../PokemonDetail.css";

const PhysicalAttributes = ({ pokemon }) => {
  return (
    <div className="PhysicalAtributes">
      <p id="Physical">Physical Attributes</p>
      <div className="Height">
        <p><span id="grey">Height:</span><br/><b> {pokemon ? (pokemon.height / 10) : ''} m</b></p>
      </div>
      <div className="Weight">
        <p><span id="grey">Weight:</span><br/><b>{pokemon ? (pokemon.weight / 10) : ''} kg</b></p>
      </div>
      <div className="Abilites">
      <p>
  <span id="grey">Abilities:</span><br/>
  <b>{pokemon ? pokemon.abilities.map((ability) => ability.ability.name).join(', ') : ''}</b>
</p>

      </div>
      <div className="BaseExperience">
        <p><span id="grey">Base Experience:</span><br/><b>{pokemon ? pokemon.base_experience : ''}</b></p>
      </div>
    </div>
  );
};

export default PhysicalAttributes;
