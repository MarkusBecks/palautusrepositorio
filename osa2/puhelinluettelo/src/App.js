import { useState, useEffect } from 'react';
import personService from './services/persons'
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('failed');
      })
  }, [])


  const upsertPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());
    if (!existingPerson) {
      // create a new person
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('');
          setNewNumber('');
          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrMessage(`Adding ${existingPerson.name} failed`)
          setTimeout(() => {
            setErrMessage(null)
          }, 3000)
        })
    } else {
      // update the existing person
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
        personService
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(persons.map(person =>
              person.id === existingPerson.id ? returnedPerson : person))
            setNewName('');
            setNewNumber('');
            setMessage(`Replaced ${existingPerson.name}'s number`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch(error => {
            setErrMessage(`Replacing ${existingPerson.name}'s number failed`)
            setTimeout(() => {
              setErrMessage(null)
            }, 3000)
          })
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const filteredPersons = filterItems(persons, filter);

  function filterItems(arr, query) {
    return arr.filter((person) =>
      person.name.toLowerCase().includes(query.toLowerCase()) ||
      person.number.includes(query));
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .destroy(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Successfully deleted ${name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrMessage(`${name} has already been removed from server`)
          setTimeout(() => {
            setErrMessage(null)
          }, 3000)
        })
    }
  }

  return (
    <div>
      <Header />
      <Notification message={message} />
      <ErrorNotification errMessage={errMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm upsertPerson={upsertPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}


const Header = () => {
  return (
    <h1>Phonebook</h1>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>filter shown with:
      <input value={filter}
        onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ upsertPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={upsertPerson}>
      <div>
        name: <input value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.id}>
          <p>{person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>Delete</button></p>
        </div>
      ))}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notif">
      {message}
    </div>
  )
}

const ErrorNotification = ({ errMessage }) => {
  if (errMessage === null) {
    return null
  }

  return (
    <div className="error-notif">
      {errMessage}
    </div>
  )
}

export default App