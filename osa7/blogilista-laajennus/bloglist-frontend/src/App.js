import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
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
import './app.css'

const App = () => {
  const addBlogFormRef = useRef()
  const dispatch = useUserDispatch()
  const { user } = useUserValue()
  const showNotification = useNotificationDispatch()

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

  const blogs = blogsQuery.data || {}

  const handleLogout = user => {
    window.localStorage.removeItem('loggedBloglistUser')
    showNotification(`See you soon, ${user.username}!`, 'success')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <div>
      {!user ? (
        <>
          <Notification />
          <LoginForm />
        </>
      ) : (
        <>
          <Navigation handleLogout={handleLogout} />
          <Notification />
          <h1>Blog app</h1>
          <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
            <AddBlogForm addBlogFormRef={addBlogFormRef} />
          </Togglable>
          <BlogList blogs={blogs} />
          <Users />
          <Routes>
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
