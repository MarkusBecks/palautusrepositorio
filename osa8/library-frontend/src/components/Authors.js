import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { loading, error, data } = useQuery(ALL_AUTHORS)

  const [editAuthorMutation] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  if (loading) {
    return <p>Loading authors...</p>
  }

  if (error) {
    return <p>Error fetching authors: {error.message}</p>
  }

  const authors = data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    editAuthorMutation({ variables: { name, setBornTo: born } })
    console.log(`${name}'s born year set to ${born}`)

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="author">Author</label>
          <select
            id="author"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value="">Select an author</option>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(+target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
