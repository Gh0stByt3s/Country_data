import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [value, setValue] = useState("");
  const [countryInfo, setCountryInfo] = useState([]);

  const handleValueChange = (event) => {
    setValue(event.target.value);
    setCountryName(value);
  };

  useEffect(() => {
    if (countryName) {
      axios
        .get("https://restcountries.com/v3.1/all")
        .then((response) => {
          setCountries(response.data.map((country) => country.name.common));
          setCountryInfo(
            response.data.map((country) => [
              {
                name: country.name.common,
                area: country.area,
                capital: country.capital,
                languages: country.languages,
                flag: country.flags,
              },
            ])
          );
        })
        .catch(() => {
          console.log("Problem");
        });
    }
  }, [countryName]);

  const showCountries = countries.filter((country) =>
    country.toLowerCase().includes(value)
  );

  const showSearchResults = (showCountries) => {
    if (showCountries.length === 0) {
      return <p>No match found</p>;
    }

    if (showCountries.length === 1) {
      const countryDisplay = countryInfo
        .map((country) => country)
        .flat(1)
        .filter(
          (country) =>
            country.name.toLowerCase() ===
            showCountries.toString().toLowerCase()
        );

      const country = countryDisplay.map(
        ({ name, area, capital, languages, flag }) => (
          <div key={name}>
            <h1>{name}</h1>
            <p>Capital: {capital}</p>
            <p>Area: {area}</p>
            <h2>Languages:</h2>
            {Object.values(languages).map((language) => {
              return <li key={language}>{language}</li>;
            })}
            <br />
            <img src={flag.png} alt={flag.alt} />
          </div>
        )
      );

      return country;
    }

    if (showCountries.length > 10) {
      return <p>Too many countries. Please be more specific</p>;
    } else {
      return JSON.stringify(showCountries, null, 2);
    }
  };

  return (
    <div>
      <p>Find countries</p>
      <input value={value} onChange={handleValueChange} />
      <div>
        <pre>{showSearchResults(showCountries)}</pre>
      </div>
    </div>
  );
};
export default App;
