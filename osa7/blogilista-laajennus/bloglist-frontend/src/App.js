import { useRef, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import { useUserValue, useUserDispatch } from './UserContext'
import blogService from './services/blogs'
import './app.css'
import Togglable from './components/Togglable'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const addBlogFormRef = useRef()
  const dispatch = useUserDispatch()
  const { user } = useUserValue()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON && !user) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: { user } })
      blogService.setToken(user.token)
    }
  }, [])

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (blogsQuery.isInitialLoading) return <div>Loading data...</div>
  if (blogsQuery.isError) return <div>Service not available</div>

  const blogs = blogsQuery.data

  const descendingLikes = (a, b) => b.likes - a.likes
  const sortedBlogs = [...blogs].sort(descendingLikes)

  return (
    <div>
      <Notification />
      <LoginForm />
      {user && (
        <>
          <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
            <AddBlogForm addBlogFormRef={addBlogFormRef} />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
