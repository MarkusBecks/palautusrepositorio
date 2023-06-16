import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const { loading, error, data } = useQuery(ALL_BOOKS)

  const [
    getBooksByGenre,
    { loading: booksLoading, error: booksError, data: booksData },
  ] = useLazyQuery(ALL_BOOKS, { variables: { genre: selectedGenre } })

  if (!props.show) {
    return null
  }

  if (loading || booksLoading) {
    return <p>Loading books...</p>
  }

  if (error || booksError) {
    return (
      <p>Error fetching books: {error ? error.message : booksError.message}</p>
    )
  }

  const books = selectedGenre
    ? booksData
      ? booksData.allBooks
      : []
    : data.allBooks

  console.log('books :', books)
  const genres =
    Array.from(new Set(data.allBooks.flatMap((book) => book.genres))) || []
  console.log('genres: ', genres)

  const filterByGenre = (genre) => {
    console.log(`Filtering books by genre: ${genre}`)
    setSelectedGenre(genre)
    getBooksByGenre({ variables: { genre } })
  }

  const removeGenreFilter = () => {
    setSelectedGenre('')
  }

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => filterByGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
      {selectedGenre ? (
        <button onClick={() => removeGenreFilter()}>show all genres</button>
      ) : null}
    </div>
  )
}

export default Books
