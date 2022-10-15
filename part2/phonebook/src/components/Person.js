const Person = ({person , removeHandler}) => {
  return (
      <li>
          {`${person.name} ${person.number}`}
          <button onClick={removeHandler}>Delete</button>
      </li>
  )
}

export default Person;
