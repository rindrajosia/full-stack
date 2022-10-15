import Weather from './Weather';

const Country = ({country}) => {

  return (
    <>
      {
        country &&
        <div>
          <h1>{country.name}</h1>
          <ul>
            <li>capital {country.capital}</li>
            <li>area {country.area}</li>
          </ul>
          <h1>Languages:</h1>
          <ul>
            {
              country.languages.map(language => {
                return(
                  <li key={language.name}>{language.name}</li>
                )
              })
            }
          </ul>
          <img src={country.flags.svg} alt="country flag" />
          <Weather capital={country.capital}/>
        </div>
      }
    </>

  )
}

export default Country;
