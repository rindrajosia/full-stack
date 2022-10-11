import { useState } from 'react'
import Statistics from './Statistics'
import Bouton from './Bouton'

const App = () => {
  // enregistrer les clics de chaque bouton dans un état différent
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <Bouton click={()=>setGood(good+1)} text="good" />
        <Bouton click={()=>setNeutral(neutral+1)} text="neutral" />
        <Bouton click={()=>setBad(bad+1)} text="Bad" />
      </div>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App
