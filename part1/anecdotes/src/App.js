import { useState } from 'react';
import Bouton from './Bouton';
import Anecdote from './Anecdote';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ];

  const [points, setPoints] = useState({});

  const [max, setMax] = useState(0);

  const [selected, setSelected] = useState(0);

  const getRandomInt = () => {
    return Math.floor(Math.random() * anecdotes.length);
  }

  const setVote = (arg) => {
    const copy = { ...points };
    if(copy.hasOwnProperty(arg)){
      copy[arg] = copy[arg] + 1;
    }else {
      copy[arg] = 1;
    }
    setPoints({...copy});
    setMax(Object.keys(copy).reduce((a, b) => copy[a] > copy[b] ? a : b));
  }


  return (
    <div>
      <Anecdote text={"Anecdote of the day"} selected={selected} anecdotes={anecdotes}/>
      <p>has {(points[selected]===undefined)? 0 : points[selected]} votes</p>
      <div>
        <Bouton click={()=>setVote(selected)} text="vote" />
        <Bouton click={()=>setSelected(getRandomInt())} text="Next anecdote" />
      </div>
      <Anecdote text={"Anecdote with most votes"} selected={max} anecdotes={anecdotes}/>
    </div>
  )
}

export default App
