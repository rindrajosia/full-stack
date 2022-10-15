import { useState, useEffect } from 'react';
import FormFilter from './components/FormFilter';
import Country from './components/Country';
import List from './components/List';
import countryService from './services/Country';

const App = () => {
  const url = 'https://restcountries.com/v2/all';
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [show, setShow] = useState();


  useEffect(() => {
    countryService
        .getAll(url)
        .then(response => {
          setCountries(countries.concat(response))
        })
  }, [])

  const countriesToShow = filter === ''
    ? []
    : countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))


  return (
    <>
      <FormFilter
        filter={filter}
        changeFilter={(e)=> setFilter(e.target.value)}
      />
      {
        countriesToShow.length > 10 ?
          <p>To many matches, specify another filter</p> :
        countriesToShow.length === 1 ?
          <Country country={countriesToShow[0]} /> :
        countriesToShow.length === 0 ?
          <p>Specify filter</p> :
          <List
            countries={countriesToShow}
            changeHidden={setShow}
          />
      }
      <Country country={countriesToShow[show]} />
    </>
  )
}

export default App
