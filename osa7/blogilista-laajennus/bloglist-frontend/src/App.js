import { useRef, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useUserValue, useUserDispatch } from './UserContext'
import { useNotificationDispatch } from './NotificationContext'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import Users from './components/Users'
import Navigation from './components/Navigation'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'
import BlogComments from './components/BlogComments'
import './app.css'

const App = () => {
  const addBlogFormRef = useRef()
  const dispatch = useUserDispatch()
  const { user } = useUserValue()
  const showNotification = useNotificationDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON && !user) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: { user } })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = user => {
    window.localStorage.removeItem('loggedBloglistUser')
    showNotification(`See you soon, ${user.username}!`, 'success')
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return (
    <>
      {!user ? (
        <>
          <Notification />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </>
      ) : (
        <>
          <Navigation handleLogout={handleLogout} />
          <Notification />
          <h1>Blog app</h1>
          <Routes>
            <Route
              path="/blogs"
              element={
                <>
                  <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
                    <AddBlogForm addBlogFormRef={addBlogFormRef} />
                  </Togglable>
                  <BlogList />
                </>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <>
                  <BlogDetails />
                  <BlogComments />
                </>
              }
            />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route
              path="*"
              element={
                <>
                  <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
                    <AddBlogForm addBlogFormRef={addBlogFormRef} />
                  </Togglable>
                  <BlogList />
                </>
              }
            />
          </Routes>
        </>
      )}
    </>
  )
}

export default App
