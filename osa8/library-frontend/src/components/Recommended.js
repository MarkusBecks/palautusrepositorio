import { ME, ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Recommended = (props) => {
  const {
    loading: userDataLoading,
    error: userDataError,
    data: userData,
  } = useQuery(ME)
  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (userDataLoading || booksLoading) {
    return <p>Loading...</p>
  }

  if (userDataError || booksError) {
    return (
      <p>
        Error fetching data:{' '}
        {userDataError ? userDataError.message : booksError.message}
      </p>
    )
  }

  const favoriteGenre = userData.me.favoriteGenre
  const books = booksData.allBooks
  const favoriteGenBooks = books.filter((book) =>
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <div>
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {favoriteGenBooks.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Recommended
