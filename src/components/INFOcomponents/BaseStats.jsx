import React from 'react';
import "../PokemonDetail"

const BaseStats = ({ pokemon }) => {
  const getBarWidth = (statValue) => {
    return (statValue / 100) * 600; 
  };

  return (
    <div className="BaseStats">
      <p id='stats'>Base Stats</p>
      <div className="all-stats">
        {pokemon && pokemon.stats.map((stat) => (
          <div key={stat.stat.name} className="stat">
            <div className="stat-name">
              {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:
            </div>
            <div className="stat-value"> {stat.base_stat}</div>
            <div className="belt">
              <div className="filled" style={{width: `${getBarWidth(stat.base_stat)}px`}}></div>
              <div className="empty" style={{width: `${570 - getBarWidth(stat.base_stat)}px`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseStats;
