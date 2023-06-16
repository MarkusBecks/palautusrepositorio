const { ApolloServer } = require('@apollo/server')
const config = require('./utils/config')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

console.log('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

 type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      try {
        let query = {}

        if (author) {
          const authorObj = await Author.findOne({ name: author })
          if (!authorObj) {
            return []
          }
          query.author = authorObj._id
        }

        if (genre) {
          query.genres = { $in: [genre] }
        }

        let books = await Book.find(query).populate('author')
        console.log('Fetched books')
        return books
      } catch (error) {
        console.error('Failed to fetch books:', error)
        throw new Error('Failed to fetch books')
      }
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    allAuthors: async () => {
      try {
        const authors = await Author.find({})
        const authorCountPromises = authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id })
          return {
            name: author.name,
            born: author.born,
            bookCount: bookCount,
          }
        })
        const authorsWithBookCount = await Promise.all(authorCountPromises)
        return authorsWithBookCount
      } catch (error) {
        throw new Error('Failed to fetch authors')
      }
    },
  },
  Book: {
    author: async (parent) => {
      try {
        const author = await Author.findById(parent.author)
        return author
      } catch (error) {
        throw new Error('Failed to fetch author')
      }
    },
  },
  Mutation: {
    addBook: async (
      root,
      { title, author, published, genres },
      { currentUser }
    ) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      try {
        if (title.length < 5) {
          throw new GraphQLError(
            'Book title must be at least 5 characters long',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: title,
              },
            }
          )
        }

        if (author.length < 4) {
          throw new GraphQLError(
            'Author name must be at least 4 characters long',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: author,
              },
            }
          )
        }

        let existingAuthor = await Author.findOne({ name: author.name })
        let book

        if (!existingAuthor) {
          const newAuthor = new Author({
            name: author,
            born: null,
            bookCount: 1,
          })
          existingAuthor = await newAuthor.save()
        } else {
          existingAuthor.bookCount++
          await existingAuthor.save()
        }

        book = new Book({
          title,
          author: existingAuthor._id,
          published,
          genres,
        })
        await book.save()

        return book
      } catch (error) {
        throw new GraphQLError('Failed to add book: ' + error.message)
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      const { name, setBornTo } = args

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      try {
        if (name.length < 4) {
          throw new GraphQLError(
            'Author name must be at least 4 characters long'
          )
        }

        const author = await Author.findOne({ name: name })

        if (!author) {
          return null
        }
        author.born = setBornTo
        await author.save()

        const updatedAuthor = await Author.findById(author._id)
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError(error.message)
      }
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args
      const user = new User({ username, favoriteGenre })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: { username, favoriteGenre },
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      if (!user || password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, config.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: config.PORT,
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
