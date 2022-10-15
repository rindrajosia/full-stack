import Bouton from './Bouton'

const List = ({countries, changeHidden}) => {
  return (

        <ul>
          {
            countries.map((country, index) => {
              return(
                <li key={country.name}>
                  {country.name}
                  <Bouton click={() => changeHidden(index)} text="show" />
                </li>
              )
            })
          }
        </ul>
      
  )
}

export default List;
