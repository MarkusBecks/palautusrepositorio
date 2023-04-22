import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, blogs, setBlogs, setSuccessMsg, setErrorMsg }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    padding: 8,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    console.log('handleLike')
    setLikes(likes + 1)
    console.log('likes: ', likes)
    try {
      await blogService.update(blog.id, { ...blog, likes: likes + 1 })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {

    console.log('blog.title: ', blog.title)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.destroy(blog.id)
        console.log('before deletion:', blogs)
        const updatedBlogs = await blogService.getAll()
        console.log('after deletion:', updatedBlogs)
        setBlogs(updatedBlogs)
        setSuccessMsg(`Blog ${blog.title} by ${blog.author} deleted.`)
      } catch (error) {
        console.log(error)
        setErrorMsg(`Error deleting blog ${blog.title}: ${error.response.data.error}`)
      }
    }
  }

  const isAuthorized = () => {
    if (blog.user && blog.user.username === user.username) {
      return true
    } else {
      return false
    }
  }

  const username = blog.user ? blog.user.username : 'anonymous'

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} | {blog.author}<button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <>
          <div>
            {blog.url}
          </div>
          <div>
            likes {likes} <button onClick={handleLike}>like</button>
          </div>
          <div>
            Added by {username}
          </div>
          {isAuthorized() && (
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