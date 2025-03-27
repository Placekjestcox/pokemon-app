import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToPokedex = () => {
  const navigate = useNavigate();

  return (
    <div className="extra-button">
      <button onClick={() => navigate('/')}> Back to Pokedex</button>
    </div>
  );
};

export default BackToPokedex;
