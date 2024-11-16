import PropTypes from 'prop-types';
import styles from './Countries.module.css';
import Country from '../Country/Country';

function Countries({ countries }) {
  return (
    <div className={styles.countriesContainer}>
      {countries.map((country) => (
        <Country key={country.cca3 || country.name.common} country={country} />
      ))}
    </div>
  );
}

Countries.propTypes = {
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      cca3: PropTypes.string,
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
    }).isRequired
  ).isRequired,
};

export default Countries;