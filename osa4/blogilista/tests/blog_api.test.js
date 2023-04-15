const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
require('../models/user');

describe('when some blogs already exist', () => {
  beforeEach(async () => {
    //await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test('correct amount of blogs are returned as json', async () => {
    const res = await api.get('/api/blogs');
    const blogsReturned = await helper.blogsInDb();

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(res.body).toHaveLength(blogsReturned.length);
  });

  test('blogs have id field named "id"', async () => {
    const res = await api.get('/api/blogs');
    const blogs = res.body;

    expect(blogs[0].id).toBeDefined();
  });

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  });

  test('an existing blog can be edited', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToEdit = blogsAtStart[0];
    const editedBlog = { likes: 99 };

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const likesAtEnd = blogsAtEnd[0].likes;
    expect(likesAtEnd).toBe(99);
  });
});
describe('creating a blog', () => {
  test('with valid data works', async () => {
    const newBlog = {
      title: 'Nice blog title',
      author: 'Andrea Authorsson',
      url: 'http://nicepost.com'
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const title = blogsAtEnd.map(b => b.title);
    expect(title).toContain(
      'Nice blog title'
    );
  });

  test('without providing likes defaults them to 0', async () => {
    const newBlog = {
      title: 'Using the schemas default value option is handy',
      author: 'Matt Nolikey',
      url: 'http://www.nolikesgiven.org'
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();

    const newBlogLikes = blogs[blogs.length - 1].likes;
    expect(newBlogLikes).toBe(0);
  });

  test('without title or url returns 400', async () => {
    const newBlog = {
      author: 'The One and Only',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('when there is initially one user at db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Kayttaja',
      name: 'super Kayttaja',
      password: 'salis',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe('creating invalid users', () => {
  test('creation fails with proper statuscode and message if username is not long enough', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'K',
      name: 'super Kayttaja',
      password: 'salis',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`K`) is shorter than the minimum allowed length (3).');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is not long enough', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Kayttis',
      name: 'super Kayttaja',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password needs to be at least 3 characters long!');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});