const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


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
        // Avoid the potential n+1 issue by fetching all authors in a single database query and then counting the books for each author using a single query per author
        try {
          const authors = await Author.find({})

          // Map over each author and create an array of promises
          const authorBookCountPromises = authors.map(async (author) => {
            // Count the number of books associated with the current author
            const bookCount = await Book.countDocuments({ author: author._id })
            
            // Return author object with bookCount
            return {
              name: author.name,
              born: author.born,
              bookCount: bookCount,
            }
          })
          // Wait for all the promises to resolve
          const authorsWithBookCount = await Promise.all(authorBookCountPromises)
         // Return the array of authors with their book counts
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
  
          let existingAuthor = await Author.findOne({ name: author })
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

          console.log('book added')
          pubsub.publish('BOOK_ADDED', { bookAdded: book })

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
    Subscription: {
        bookAdded: {
          subscribe: () => {
            console.log('entered bookAdded subscription')
            return pubsub.asyncIterator('BOOK_ADDED')
          }
        },
      },    
  }

  module.exports = resolvers