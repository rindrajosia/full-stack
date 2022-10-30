import { useState, useEffect } from 'react';
import Person from './components/Person';
import FormUser from './components/FormUser';
import FormFilter from './components/FormFilter';
import phone from './services/Phone';
import Notification from './components/Notification';

const App = () => {
  let maxId = 0;
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('some error happened...');
  const [style, setStyle] = useState('success');

  useEffect(()=> {
    phone
        .getAll('/api/persons')
        .then(response => {
          setPersons(persons.concat(response));
          setErrorMessage(
            `Connecting to Server Successfully`
          )
          setStyle('success')

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
        setErrorMessage(
          `Error from Server`
        )
        setStyle('error')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      });
  }, [])

  const isPresent = () =>{

    const pers = persons.find(person => person.name === newName);

    return pers=== undefined ? false : true;
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))



  const removeHandler = (person) =>{
     if(window.confirm(`Delete ${person.name} ?`)) {
       phone
           .remove('/api/persons/', person.id)
           .then(response => {
             setPersons(persons.filter(n => n.id !== person.id));

             setErrorMessage(
               `${person.name}' was removed from server successfully`
             )
             setStyle('success')

             setTimeout(() => {
               setErrorMessage(null)
             }, 5000)

           })
           .catch(error => {
             setErrorMessage(
               `'${person.name}' was already removed from server`
             )
             setStyle('error')

             setTimeout(() => {
               setErrorMessage(null)
             }, 5000)

             setPersons(persons.filter(n => n.id !== person.id));
           });
     }

  }




  const submitHandler = (e) => {
    e.preventDefault();

    const ids = persons.map(persons => {
      return persons.id;
    });


    if(isPresent()) {
        const pers = persons.find(person => person.name === newName);

        const data = {...pers,
          name: newName,
          number: number,
        };


        if(window.confirm(`${newName} is already added to phonebook,
          replace the old number with new one ?`)) {

          phone
          .update(`/api/persons/${pers.id}`, data)
          .then(response => {
            setPersons(persons.map(n => n.id !== pers.id ? n : response));

            setErrorMessage(
              `${response.name}' was updated successfully`
            )
            setStyle('success')

            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

          })
          .catch(error => {
            setErrorMessage(
              `${error.response.data.error}`
            )
            setStyle('error')

            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

          });
        }

    } else {
      maxId = Math.max(...ids);

      const data = {
        name: newName,
        number: number,
        id: maxId + 1,
      }

      phone
      .create('/api/persons', data)
      .then(response => {
        setPersons(persons.concat(response));

        setErrorMessage(
          `${response.name}' was added successfully`
        )
        setStyle('success')

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(
          `${error.response.data.error}`
        )
        setStyle('error')

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      });
    }

    setNewName('');
    setNumber('');

  }

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} style={style}/>
      <FormFilter
        filter={filter}
        changeFilter={(e)=>setFilter(e.target.value)}
      />
      <h2>Add a new</h2>
      <FormUser
        submitForm={(e)=>submitHandler(e)}
        valueName={newName}
        changeName={(e)=>setNewName(e.target.value)}
        valueNumber={number}
        changeNumber={(e)=>setNumber(e.target.value)}
      />

      <h2>Numbers</h2>
      <ul>
        {
          personsToShow.map(person => {
            return(
              <Person
                key={person.id}
                person={person}
                removeHandler={() => removeHandler(person)}
              />
            )
          })
        }
      </ul>

    </>
  )
}

export default App
