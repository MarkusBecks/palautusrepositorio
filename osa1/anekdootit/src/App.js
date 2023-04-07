import { useState } from 'react'

const AotdHeader = () => (
  <h2>Anecdote of the day</h2>
);

const MostVotes = ({ copy, anecdotes }) => {
  const maxVotes = Math.max(...copy);
  const maxIndex = copy.indexOf(maxVotes);
  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[maxIndex]}</p>
      <p>has {maxVotes} votes</p>
    </div>
  )
}

const DisplayVotes = ({ votes }) => (
  <p>has {votes} votes</p>
);

const Button = ({ handleAnecdoteClick, handleVoteClick }) => {
  return (
    <div>
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleAnecdoteClick}>random anecdote</button>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const [copy, setCopy] = useState([...votes]);

  const handleAnecdoteClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVoteClick = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
    setCopy(copy);
  };

  return (
    <div>
      <AotdHeader />
      {anecdotes[selected]}
      <DisplayVotes votes={votes[selected]} />
      <Button handleAnecdoteClick={handleAnecdoteClick} handleVoteClick={handleVoteClick} />
      {/* only display component if a vote has been cast */}
      {Math.max(...copy) > 0 && <MostVotes copy={copy} anecdotes={anecdotes} />}
    </div>
  );
};

export default App