import { useState, useEffect } from 'react';
import Countries from './components/Countries/Countries';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [subregions, setSubregions] = useState([]);
  const [filter, setFilter] = useState({ continent: '', subregion: '', top10: '' });
  const [isAlphabeticallySorted, setIsAlphabeticallySorted] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,area,continents,subregion')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);

        const uniqueSubregions = Array.from(
          new Set(data.map((country) => country.subregion).filter((subregion) => subregion))
        ).sort();
        setSubregions(uniqueSubregions);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleFilterChange = (type, value) => {
    const newFilter = { ...filter, [type]: value };
  
    if (type === 'continent') newFilter.subregion = '';
    if (type === 'subregion') newFilter.continent = '';
  
    let data = [...countries];
  
    if (newFilter.continent) {
      if (newFilter.continent === "Americas") {
        data = data.filter(
          (c) => c.continents.includes("North America") || c.continents.includes("South America")
        );
      } else {
        data = data.filter((c) => c.continents.includes(newFilter.continent));
      }
    }
  
    if (newFilter.subregion) {
      data = data.filter((c) => c.subregion === newFilter.subregion);
    }
  
    if (newFilter.top10) {
      data.sort((a, b) =>
        newFilter.top10 === 'population' ? b.population - a.population : b.area - a.area
      );
      data = data.slice(0, 10);
    }
  
    setIsAlphabeticallySorted(false);
  
    setFilter(newFilter);
    setFilteredCountries(data);
  };

  const handleSortAlphabetically = () => {
    let data = [...filteredCountries];

    if (isAlphabeticallySorted) {
      data = [...countries];
    } else {
      data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }

    setFilteredCountries(data);
    setIsAlphabeticallySorted(!isAlphabeticallySorted);
  };

  return (
    <div className="App">
      <h1 className="title">Country Explorer</h1>
      <div className="filters">
        <select onChange={(e) => handleFilterChange('continent', e.target.value)}>
          <option value="">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="Africa">Africa</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
          <option value="Americas">Americas</option>
        </select>
        <select onChange={(e) => handleFilterChange('subregion', e.target.value)}>
          <option value="">All Subregions</option>
          {subregions.map((subregion) => (
            <option key={subregion} value={subregion}>
              {subregion}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange('top10', e.target.value)}>
          <option value="">Top 10</option>
          <option value="population">By Population</option>
          <option value="area">By Area</option>
        </select>
        <button
          className={`sortButton ${isAlphabeticallySorted ? 'active' : ''}`}
          onClick={handleSortAlphabetically}
        >
          Sort Alphabetically
        </button>
      </div>
      <Countries countries={filteredCountries} />
    </div>
  );
}

export default App;