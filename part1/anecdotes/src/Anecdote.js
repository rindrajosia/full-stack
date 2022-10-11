const Anecdote = ({text, selected, anecdotes}) => {

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
    </div>
  )
}

export default Anecdote
