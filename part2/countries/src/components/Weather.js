import { useState, useEffect } from 'react';
import weatherService from '../services/Country';

const Weather = ({capital}) => {
  const api_key = process.env.REACT_APP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${capital}&units=Metric&APPID=${api_key}`;
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        weatherService
            .getAll(url)
            .then(response => {
              setWeather({
                ...weather,
                temp: response.list[0].main.temp,
                wind: response.list[0].wind.speed,
                icon: response.list[0].weather[0].icon
              });
              setLoading(false);
            })
    },[]);


  return (
      <>
        {
          (loading === true) ?
          <h1>Loading</h1> :
          <>
            <h1>Weather in {capital} </h1>
            <p>temperature {weather.temp} Celcius</p>
            <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="icon"/>
            <p>wind {weather.wind}</p>
          </>
        }

      </>
    )
}

export default Weather;
