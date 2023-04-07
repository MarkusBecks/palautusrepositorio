import { useState, useEffect } from "react";
import axios from 'axios';
import './app.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');


  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data);
      console.log(response.data);
    })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const handleCountryClick = (countryName) => {
    setFilter(countryName);
  }

  const filteredCountries = filterItems(countries, filter);

  function filterItems(arr, query) {
    return arr.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase()))
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries filteredCountries={filteredCountries} handleCountryClick={handleCountryClick} />
    </div>
  );
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>find countries:
      <input value={filter}
        onChange={handleFilterChange} />
    </div>
  )
}

const Countries = ({ filteredCountries, handleCountryClick }) => {
  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map(country => (
          <div key={country.name.common}>
            <p>{country.name.common} <Button handleCountryClick={() => handleCountryClick(country.name.common)} /></p>
          </div>
        ))}
      </div>
    )
  } else if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital: {country.capital}</div>
        <div>population: {country.population}</div>
        <div>area: {country.area}</div>
        <br></br>
        <div>
          <p><strong>languages:</strong></p>
          <ul>
            {Object.entries(country.languages).map(([code, name]) => (
              <li key={code}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="flag-container">
          <img src={country.flags.png} />
        </div>
        <CountryWeather filteredCountries={filteredCountries} />
      </div >
    )
  } else {
    return (
      null
    )
  }
}

const Button = ({ handleCountryClick }) => {
  return (
    <button onClick={handleCountryClick}>Show</button>
  );
}

const CountryWeather = ({ filteredCountries }) => {
  const api_key = process.env.REACT_APP_WEATHER_API_KEY;
  const country = filteredCountries[0];
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`;

  const iconUrl = 'https://openweathermap.org/img/wn/';
  const iconUrlExt = '@2x.png';

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get(weatherUrl).then(response => {
      setWeatherData(response.data);
    }).catch(error => {
      console.log(error);
    })
  }, [weatherUrl]);
  console.log(weatherData);

  return (
    <div>
      {weatherData ? (
        <>
          <h3>Weather in {country.capital}</h3>
          <div>
            Temperature: {weatherData.main.temp}°C
          </div>
          <div>
            <img key={weatherData.weather[0].icon} src={`${iconUrl}${weatherData.weather[0].icon}${iconUrlExt}`} />
          </div>
          <div>
            Wind: {weatherData.wind.speed} m/s
          </div>
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}

export default App;
