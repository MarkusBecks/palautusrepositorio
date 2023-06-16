import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState('')

  if (!props.show) {
    return null
  }

  if (loading) {
    return <p>Loading books...</p>
  }

  if (error) {
    return <p>Error fetching books: {error.message}</p>
  }

  const books = data.allBooks
  const genres = Array.from(new Set(books.flatMap((book) => book.genres)))

  const filterByGenre = (genre) => {
    console.log(`Filtering books by genre: ${genre}`)
    setSelectedGenre(genre)
  }

  const removeGenreFilter = () => {
    setSelectedGenre('')
  }

  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books

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
          {filteredBooks.map((b) => (
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
