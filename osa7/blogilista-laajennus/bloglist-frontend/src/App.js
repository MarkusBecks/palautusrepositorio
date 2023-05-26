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
import { Wrapper } from './components/LoginForm'
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
        <Wrapper>
          <Notification />
          <LoginForm />
        </Wrapper>
      ) : (
        <div>
          <Navigation handleLogout={handleLogout} />
          <Wrapper>
            <Notification />
            <Routes>
              <Route
                path="/blogs"
                element={
                  <>
                    <BlogList />
                    <Togglable
                      openLabel="new blog"
                      closeLabel="cancel"
                      ref={addBlogFormRef}
                    >
                      <AddBlogForm addBlogFormRef={addBlogFormRef} />
                    </Togglable>
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
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="*"
                element={
                  <>
                    <BlogList />
                    <Togglable
                      openLabel="new blog"
                      closeLabel="cancel"
                      ref={addBlogFormRef}
                    >
                      <AddBlogForm addBlogFormRef={addBlogFormRef} />
                    </Togglable>
                  </>
                }
              />
            </Routes>
          </Wrapper>
        </div>
      )}
    </>
  )
}

export default App
