import React, { useState } from "react";

const Moves = ({ pokemon }) => {
  const moves = pokemon?.moves || [];
  const [showAll, setShowAll] = useState(false);

  const groupMoves = (moves) => {
    const grouped = [];
    for (let i = 0; i < moves.length; i += 4) {
      grouped.push(moves.slice(i, i + 4));
    }
    return grouped;
  };
  const displayedMoves = showAll ? groupMoves(moves) : groupMoves(moves).slice(0, 4);

  return (
    <div className="Moves">
      <p>Moves</p>
      <table className="moves-table">
        <tbody>
          {displayedMoves.map((group, index) => (
            <tr key={index}>
              {group.map((move, i) => (
                <td key={i}>{move.move.name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button id="movesbutton" onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default Moves;
