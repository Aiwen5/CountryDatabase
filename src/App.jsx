import { useState, useEffect } from 'react';
import Countries from './components/Countries/Countries';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [subregions, setSubregions] = useState([]);
  const [filter, setFilter] = useState({ continent: '', subregion: '', top10: '' });
  const [isAlphabeticallySorted, setIsAlphabeticallySorted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,area,continents,subregion')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch country data');
        return response.json();
      })
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);

        const uniqueSubregions = Array.from(
          new Set(data.map((country) => country.subregion).filter((subregion) => subregion))
        ).sort();
        setSubregions(uniqueSubregions);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleFilterChange = (type, value) => {
    const newFilter = { ...filter, [type]: value };

    if (type === 'continent') newFilter.subregion = '';
    if (type === 'subregion') newFilter.continent = '';

    let data = [...countries];

    if (newFilter.continent) {
      if (newFilter.continent === 'North America') {
        data = data.filter((c) => c.continents.includes('North America'));
      } else if (newFilter.continent === 'South America') {
        data = data.filter((c) => c.continents.includes('South America'));
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

  const resetFilters = () => {
    setFilter({ continent: '', subregion: '', top10: '' });
    setIsAlphabeticallySorted(false);
    setFilteredCountries(countries);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1 className="title">Country Explorer</h1>
      <div className="filters">
        <select
          value={filter.continent}
          onChange={(e) => handleFilterChange('continent', e.target.value)}
          aria-label="Filter by Continent"
        >
          <option value="">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="Africa">Africa</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
        </select>
        <select
          value={filter.subregion}
          onChange={(e) => handleFilterChange('subregion', e.target.value)}
          aria-label="Filter by Subregion"
        >
          <option value="">All Subregions</option>
          {subregions.map((subregion) => (
            <option key={subregion} value={subregion}>
              {subregion}
            </option>
          ))}
        </select>
        <select
          value={filter.top10}
          onChange={(e) => handleFilterChange('top10', e.target.value)}
          aria-label="Filter Top 10"
        >
          <option value="">All</option>
          <option value="population">By Population</option>
          <option value="area">By Area</option>
        </select>
        <button
          className={`sortButton ${isAlphabeticallySorted ? 'active' : ''}`}
          onClick={handleSortAlphabetically}
        >
          Sort Alphabetically
        </button>
        <button className="resetButton" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      <Countries countries={filteredCountries} />
    </div>
  );
}

export default App;