const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../test_helper')
const Blog = require('../../models/blog')
const app = require('../../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when some blogs already exist', () => {
  test('correct amount of blogs are returned as json', async () => {
    const res = await api.get('/api/blogs')
    const blogsReturned = await helper.blogsInDb()

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(blogsReturned.length)
  })

  test('blogs have id field named "id"', async () => {
    const res = await api.get('/api/blogs')
    const blogs = res.body

    expect(blogs[0].id).toBeDefined()
  })

  test('an existing blog can be edited', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    const editedBlog = { likes: 99 }

    await api.put(`/api/blogs/${blogToEdit.id}`).send(editedBlog).expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const likesAtEnd = blogsAtEnd[0].likes
    expect(likesAtEnd).toBe(99)
  })
})

describe('using token based authentication', () => {
  let userToken
  const newUser = {
    username: 'testuser',
    password: 'test',
  }
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
  }

  beforeEach(async () => {
    await helper.removeTestUser()
    await helper.removeTestBlog()
    await api.post('/api/users').send(newUser)

    const result = await api.post('/api/login').send({
      username: newUser.username,
      password: newUser.password,
    })

    userToken = result.body.token
  })

  describe('adding a new blog', () => {
    test('a valid blog can be added', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterAddition = await helper.blogsInDb()

      expect(blogsAfterAddition).toHaveLength(helper.initialBlogs.length + 1)
      expect(blogsAfterAddition.map(b => b.title)).toContain('Test Blog')
    })

    test('without providing likes defaults them to 0', async () => {
      const noLikesBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
      }
      await api
        .post('/api/blogs')
        .send(noLikesBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDb()

      const noLikes = blogs[blogs.length - 1].likes
      expect(noLikes).toBe(0)
    })

    test('without title or url returns 400', async () => {
      const authorOnlyBlog = {
        author: 'The One and Only',
      }
      await api
        .post('/api/blogs')
        .send(authorOnlyBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('without token returns 401', async () => {
      const result = await api.post('/api/blogs').send(newBlog).expect(401)

      expect(result.body.error).toContain('missing token')

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deleting a blog', () => {
    test('a blog can be deleted after adding it', async () => {
      //first create a blog with a logged in user
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()

      const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
      console.log('blogToDelete: ', blogToDelete)

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
      expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    })
  })
})

test('user creation fails with proper statuscode and message when username exists', async () => {
  const usersAtStart = await helper.usersInDb()

  const existingUser = {
    username: 'make',
    password: 'make',
  }

  const result = await api
    .post('/api/users')
    .send(existingUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('expected `username` to be unique')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

describe('creating invalid users', () => {
  test('creation fails with proper statuscode and message if username is not long enough', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUser = {
      username: 'T',
      password: 'testpassword',
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'User validation failed: username: Path `username` (`T`) is shorter than the minimum allowed length (3).'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is not long enough', async () => {
    const usersAtStart = await helper.usersInDb()

    const invalidUser = {
      username: 'Testuser',
      password: 't',
    }

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'password needs to be at least 3 characters long!'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
