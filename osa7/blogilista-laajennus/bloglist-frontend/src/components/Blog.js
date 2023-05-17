import { useState } from 'react'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const showNotification = useNotificationDispatch()
  const queryClient = useQueryClient()

  const blogStyle = {
    padding: 8,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      console.log('Update successful')
    },
    onError: error => {
      showNotification(error.response.data.error, 'error')
    },
  })

  const handleLike = blog => {
    console.log('handleLike blog :', blog)
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    console.log('handleLike updatedBlog :', updatedBlog)
    updateBlogMutation.mutate(blog.id, updatedBlog)
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.destroy,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      showNotification(
        `Blog '${blog.title}' by ${blog.author} deleted.`,
        'success'
      )
    },
    onError: error => {
      showNotification(
        `Error deleting blog '${blog.title}': ${error.response.data.error}`,
        'error'
      )
    },
  })

  const handleDelete = id => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      deleteBlogMutation.mutate(id)
    }
  }

  const isAuthorized = blog.user && blog.user.username === user.username

  const username =
    blog.user && blog.user.username ? blog.user.username : 'anonymous'

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-title-and-author">
        {blog.title} | {blog.author}
        <button onClick={toggleVisibility} className="viewButton">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <>
          <div className="url">{blog.url}</div>
          <div className="likes">
            likes {blog.likes}
            <button
              disabled={updateBlogMutation.isLoading}
              onClick={() => handleLike(blog)}
              className="likesButton"
            >
              like
            </button>
          </div>
          <div className="username">Added by {username}</div>
          {isAuthorized && (
            <div>
              <button onClick={() => handleDelete(blog.id)}>remove blog</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
