import StatisticLine from './StatisticLine'

const Statistics = ({good, neutral, bad}) => {
  const calcAll = () => {
    return (good + neutral + bad);
  }

  const calcAverage = () => {
    return ((good - bad)/(calcAll()));
  }

  const calcPositive = () => {
    return ((good * 100)/(calcAll()));
  }



  if(good === 0 && neutral === 0 && bad === 0){
    return (
      <>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </>
    )
  } else {
    return (
      <>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text="good" value ={good} />
            <StatisticLine text="neutral" value ={neutral} />
            <StatisticLine text="bad" value ={bad} />
            <StatisticLine text="all" value ={calcAll()} />
            <StatisticLine text="average" value ={calcAverage()} />
            <StatisticLine text="positive" value ={calcPositive()} />
          </tbody>
        </table>
      </>
    )

  }
}

export default Statistics;
