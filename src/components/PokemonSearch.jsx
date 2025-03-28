import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PokemonSearch = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [favorites, setFavorites] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadedRanges, setLoadedRanges] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }}, []); 
  const ranges = useMemo(() => [
    { start: 1, end: 100 },
    { start: 101, end: 200 },
    { start: 201, end: 300 },
    { start: 301, end: 400 },
    { start: 401, end: 500 },
    { start: 501, end: 600 },
    { start: 601, end: 700 },
    { start: 701, end: 800 },
    { start: 801, end: 900 },
    { start: 901, end: 1000 },
    { start: 1001, end: 1100 },
    { start: 1101, end: 1200 },
    { start: 1201, end: 1300 },
    { start: 1301, end: 1400 },
    { start: 1401, end: 1500 },
    { start: 1501, end: 1600 },
    { start: 1601, end: 1700 },
    { start: 1701, end: 1800 },
    { start: 1801, end: 1900 },
    { start: 1901, end: 2000 },
  ], []);
  const fetchPokemonsInRange = useCallback(async (range) => {
    if (loading) return;
    setLoading(true);
    try {
      const { start, end } = range;
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${end - start + 1}&offset=${start - 1}`);
      setPokemonList((prevList) => {
        const newPokemons = response.data.results.filter(pokemon =>
          !prevList.some(existingPokemon => existingPokemon.name === pokemon.name)
        );
        return [...prevList, ...newPokemons];
      });
      setLoadedRanges(prevRanges => [...prevRanges, range]);
    } catch (error) {
      console.error("Błąd pobierania Pokémonów:", error);
    } finally {
      setLoading(false);
    }}, [loading]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollThreshold = documentHeight * 0.9;

    if (scrollPosition >= scrollThreshold && searchQuery === '') {
      for (const range of ranges) {
        if (!loadedRanges.some(loadedRange => loadedRange.start === range.start && loadedRange.end === range.end)) {
          fetchPokemonsInRange(range);
          break;}}}}, [ranges, loadedRanges, searchQuery, fetchPokemonsInRange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);}, [handleScroll]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsSearching(true);
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000');
      const filteredPokemons = response.data.results.filter(pokemon => {
        const pokemonId = pokemon.url.split('/')[6];
        return pokemonId.includes(searchQuery) || pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());});
      setPokemonList(filteredPokemons);
      setIsSearching(false);};

    if (searchQuery) {
      setPokemonList([]);
      fetchSearchResults();
    } else {
      if (loadedRanges.length === 0) {
        fetchPokemonsInRange(ranges[0]);
      }}}, [searchQuery, loadedRanges, fetchPokemonsInRange, ranges]);

  const toggleFavorite = (pokemon) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.some(fav => fav.name === pokemon.name)
        ? prevFavorites.filter((fav) => fav.name !== pokemon.name)
        : [...prevFavorites, pokemon];
      localStorage.setItem("favorites", JSON.stringify(newFavorites)); 
      return newFavorites;
    });
  };

  const formatPokemonId = (id) => {
    return `#${String(id).padStart(3, '0')}`;
  };

  const filterPokemons = (pokemons) => {
    if (!searchQuery) return pokemons;
    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.url.includes(searchQuery)
    );
  };

  const displayedPokemons = showFavorites ? filterPokemons(favorites) : filterPokemons(pokemonList);

  const handleCleanSearch = () => {
    setSearchQuery('');
    window.location.reload(); 
  };

  return (
    <div className="pokemon-search">
      <nav className="navbar">
        <input type="text" placeholder="Wyszukaj pokemona po nazwie lub ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input"/>
        <button onClick={() => setShowFavorites(false)} className={`nav-button ${!showFavorites ? "active" : ""}`}>Home</button>
        <button onClick={handleCleanSearch} className="nav-button">Clean</button><button onClick={() => setShowFavorites(true)} className={`nav-button ${showFavorites ? "active" : ""}`}>Lista ulubionych</button>
      </nav>
      <div className="pokemon-grid">
        {isSearching && <div>Wyszukiwanie...</div>}
        {!isSearching && displayedPokemons.length === 0 && <div>Brak wyników!</div>}
        {displayedPokemons.map((pokemon, index) => {
          const pokemonId = pokemon.url ? pokemon.url.split('/')[6] : pokemon.id;
          const isFavorite = favorites.some(fav => fav.name === pokemon.name);

          return (
            <div className="pokemonitem" key={index}>
              <Link to={`/pokemon/${pokemonId}`} className="pokemon-link">
                <div className="top">
                  <p className="pokemon-id">{formatPokemonId(pokemonId)}</p>
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`} alt={pokemon.name}/>
                </div>
              </Link>
              <div className="bottom">
                <div className="bottomleft">
                  <Link to={`/pokemon/${pokemonId}`} className="pokemon-link">
                    <p id="pokemonname">{pokemon.name}</p>
                  </Link>
                </div>
                <div className="bottomright">
                  <button onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleFavorite(pokemon);}} 
                  className="favorite-button">
                  {isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div>Ładowanie...</div>}
    </div>
  );
};

export default PokemonSearch;
