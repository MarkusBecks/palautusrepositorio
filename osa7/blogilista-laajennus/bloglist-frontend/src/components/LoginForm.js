import { useState } from 'react'
//import PropTypes from 'prop-types'
import { useUserDispatch } from '../UserContext'
import loginService from '../services/login'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useUserDispatch()
  const showNotification = useNotificationDispatch()
  const navigate = useNavigate()

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUsername('')
      setPassword('')

      dispatch({ type: 'LOGIN', payload: { user } })
      showNotification(`Welcome, ${username}!`, 'success')
      navigate('/blogs')
    } catch (error) {
      showNotification(error.response.data.error, 'error')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

/* LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
} */

export default LoginForm
