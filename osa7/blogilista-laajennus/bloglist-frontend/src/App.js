import { useState, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery } from 'react-query'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const showNotification = useNotificationDispatch()
  const addBlogFormRef = useRef()

  const result = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false,
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>Service not available due to problems in server</div>
  }

  const descendingLikes = (a, b) => b.likes - a.likes
  const blogs = result.data
  const sortedBlogs = [...blogs].sort(descendingLikes)

  /* useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, []) */

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome, ${username}!`, 'success')
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
  }

  const handleLogout = username => {
    window.localStorage.removeItem('loggedBloglistUser')
    showNotification(`See you soon, ${username}`, 'success')
    setUser(null)
  }

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in{' '}
            <button onClick={() => handleLogout(user.username)}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
            <AddBlogForm addBlogFormRef={addBlogFormRef} />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog key={blog.id} blog={blog} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
