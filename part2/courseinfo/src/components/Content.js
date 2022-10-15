import Part from './Part';

const Content = ({parts}) => {
  return (
    <ul>
      {parts.map(part => {
        return(
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        )
      })}
    </ul>
  )
}

export default Content;
