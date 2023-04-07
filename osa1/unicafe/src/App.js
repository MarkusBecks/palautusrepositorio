import { useState } from 'react';

const Header = () => (<h2>give feedback</h2>);

const Button = (props) => {
  return (
    <div>
      <button onClick={props.onClickGood}>good</button>
      <button onClick={props.onClickNeutral}>neutral</button>
      <button onClick={props.onClickBad}>bad</button>
    </div>
  );
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
}

const Statistics = ({ good, neutral, bad, total }) => {
  if (total !== 0) {// näytä vain, jos palautetta
    const positive = good;
    const negative = bad * -1;
    const average = ((positive + negative) / total).toFixed(2);
    const ratio = ((good / total) * 100).toFixed(2) + '%';

    return (
      <div>
        <h2>statistics</h2>
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={total} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={ratio} />
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  }
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad;

  const handleClickGood = () => (setGood(good + 1))
  const handleClickNeutral = () => (setNeutral(neutral + 1))
  const handleClickBad = () => (setBad(bad + 1))

  return (
    <div>
      <Header />
      <Button onClickGood={handleClickGood} onClickNeutral={handleClickNeutral} onClickBad={handleClickBad} />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
}

export default App;