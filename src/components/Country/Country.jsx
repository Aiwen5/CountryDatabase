import PropTypes from 'prop-types';
import styles from './Country.module.css';

function Country({ country }) {
  const handleCardClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      country.name.common
    )}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className={styles.countryCard} onClick={handleCardClick} role="button" tabIndex={0}>
      <img className={styles.flag} src={country.flags.png} alt={`${country.name.common} flag`} />
      <h2 className={styles.name}>{country.name.common}</h2>
      <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
      <p><strong>Continent:</strong> {country.continents[0]}</p>
      <p><strong>Sub-region:</strong> {country.subregion || 'N/A'}</p>
    </div>
  );
}

Country.propTypes = {
  country: PropTypes.shape({
    name: PropTypes.shape({
      common: PropTypes.string.isRequired,
    }).isRequired,
    flags: PropTypes.shape({
      png: PropTypes.string.isRequired,
    }).isRequired,
    capital: PropTypes.arrayOf(PropTypes.string),
    population: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
    continents: PropTypes.arrayOf(PropTypes.string).isRequired,
    subregion: PropTypes.string,
  }).isRequired,
};

export default Country;