import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; 
import PokemonSearch from './components/PokemonSearch';
import PokemonDetail from './components/PokemonDetail';
import './App.css';
import "./components/Responsive.css";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PokemonSearch />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
