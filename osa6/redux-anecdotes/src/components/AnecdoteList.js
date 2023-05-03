import { useSelector, useDispatch } from "react-redux"
import { updateVotes } from "../reducers/anecdoteReducer"
import { showNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const { filter, anecdotes } = useSelector(state => state)
  console.log('AnecdoteList anecdotes: ', anecdotes)

  const handleVote = (id) => {
    console.log('handleVote id: ', id);
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    dispatch(updateVotes(id))
    dispatch(showNotification(`You voted: '${anecdoteToVote.content}'`, 5))
  };

  const filteredAnecdotes = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = filteredAnecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList