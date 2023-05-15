import { useState } from 'react'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const Blog = ({ blog, user, blogs, setBlogs, handleLike }) => {
  const [visible, setVisible] = useState(false)
  const showNotification = useNotificationDispatch()

  const blogStyle = {
    padding: 8,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleDelete = async () => {
    console.log('blog.title: ', blog.title)
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      try {
        await blogService.destroy(blog.id)
        console.log('before deletion:', blogs)
        const updatedBlogs = await blogService.getAll()
        console.log('after deletion:', updatedBlogs)
        setBlogs(updatedBlogs)
        //setSuccessMsg(`Blog ${blog.title} by ${blog.author} deleted.`)
        showNotification(
          `Blog '${blog.title}' by ${blog.author} deleted.`,
          'success'
        )
      } catch (error) {
        console.log(error)
        /* setErrorMsg(
          `Error deleting blog ${blog.title}: ${error.response.data.error}`
        ) */
        showNotification(
          `Error deleting blog '${blog.title}': ${error.response.data.error}`,
          'error'
        )
      }
    }
  }

  const isAuthorized = blog.user && blog.user.username === user.username

  console.log('blog:', blog)
  console.log('user:', user)
  const username =
    blog.user && blog.user.username ? blog.user.username : 'anonymous'

  console.log('username:', username)
  console.log('blog.user.username:', blog.user ? blog.user.username : 'N/A')

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
            <button onClick={() => handleLike(blog.id)} className="likesButton">
              like
            </button>
          </div>
          <div className="username">Added by {username}</div>
          {isAuthorized && (
            <div>
              <button onClick={handleDelete}>remove blog</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
