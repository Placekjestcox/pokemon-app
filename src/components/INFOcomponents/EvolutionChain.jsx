import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const EvolutionChain = ({ pokemonId }) => {
  const [evolutionChain, setEvolutionChain] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (pokemonId) {
      const fetchEvolutionChain = async () => {
        try {
            const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
            );
            const evolutionResponse = await axios.get(response.data.evolution_chain.url);
            const chain = [];
            let evo = evolutionResponse.data.chain;
            while (evo) {
              const speciesUrlParts = evo.species.url.split("/");
              const speciesId = speciesUrlParts[speciesUrlParts.length - 2]; 
              chain.push({
              name: evo.species.name.charAt(0).toUpperCase() + evo.species.name.slice(1),
              id: speciesId, 
              });
              evo = evo.evolves_to.length > 0 ? evo.evolves_to[0] : null;
            }
            setEvolutionChain(chain);
          } catch (error) {
            console.error("Error", error);
            setEvolutionChain([]);
          }
      };
      fetchEvolutionChain();
    }
  }, [pokemonId]);

  const handleEvolutionClick = (id) => {
    navigate(`/pokemon/${id}`); 
  };

  return (
    <div className="EvolutionChain">
      <p id="Evo">Evolution Chain</p>
      <div className="evolution-images">
        {evolutionChain.map((evolution, index) => (
          <React.Fragment key={evolution.id}>
            <div 
              className={`evolution ${evolution.id === String(pokemonId) ? "highlight" : ""}`} 
              onClick={() => handleEvolutionClick(evolution.id)}
            >
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`} 
                alt={evolution.name}
              />
              <p>{evolution.name}</p>
            </div>
            {index < evolutionChain.length - 1 && <span id="arrow"> &gt; </span>} 
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EvolutionChain;
