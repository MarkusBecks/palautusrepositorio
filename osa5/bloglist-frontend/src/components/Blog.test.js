import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'

describe('<Blog /> rendering', () => {
  const blog = {
    title: 'Crazy blog title',
    author: 'Markus Becks',
    url: 'http://blog.com/',
    likes: 6
  }

  test('blog title is rendered correctly', () => {
    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog-title-and-author')
    expect(div).toHaveTextContent(
      'Crazy blog title'
    )
  })

  test('blog url, likes and username are shown when view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlDiv = container.querySelector('.url')
    expect(urlDiv).toHaveTextContent('http://blog.com/')
    const likesDiv = container.querySelector('.likes')
    expect(likesDiv).toHaveTextContent('6')
    const usernameDiv = container.querySelector('.username')
    expect(usernameDiv).toHaveTextContent('Added by anonymous')
  })

  test('calls handleLike function when likeButton is clicked', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = await screen.findByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    screen.debug()

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('new blog is created correctly', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<AddBlogForm addBlog={createBlog} buttonLabel='create' />)

    const title = screen.getByPlaceholderText('title of the blog')
    const author = screen.getByPlaceholderText('author of the blog')
    const url = screen.getByPlaceholderText('url to the blog post')
    const createButton = screen.getByText('create')

    await user.type(title, 'Super duper title')
    await user.type(author, 'Ronald McDonald')
    await user.type(url, 'superblog.com/ronnymcd')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Super duper title')
    expect(createBlog.mock.calls[0][0].author).toBe('Ronald McDonald')
    expect(createBlog.mock.calls[0][0].url).toBe('superblog.com/ronnymcd')
  })
})