const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id/comments', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    const comments = blog.comments
    res.json(comments)
  } else {
    res.status(404).end()
  }
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const blog = await Blog.findById(id)

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  blog.comments.push({ content })
  const savedBlog = await blog.save()

  res.status(201).json(savedBlog)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user
  console.log('user object: ', user)
  console.log('user id: ', user.id)
  if (!user) {
    return res.status(401).json({ error: 'authentication failed' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).end()
  }
  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  console.log('req.params.id:', req.params.id)
  console.log('req.body:', req.body)

  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 })

  console.log('updatedBlog:', updatedBlog)

  res.json(updatedBlog)
})

module.exports = blogsRouter
