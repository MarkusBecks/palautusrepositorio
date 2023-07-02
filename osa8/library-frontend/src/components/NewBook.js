import { useState } from 'react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from '../queries'
import { useMutation, useSubscription } from '@apollo/client'
import { computeHeadingLevel } from '@testing-library/react'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const bookAdded = data.data.bookAdded;
      if (bookAdded) {
        console.log('bookAdded: ', bookAdded)
        window.alert(`New book added!\nTitle: ${bookAdded.title}\nAuthor: ${bookAdded.author.name}`);
      }
    },
  });

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({
      variables: {
        title,
        author,
        published,
        genres,
      },
    })

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(+target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
