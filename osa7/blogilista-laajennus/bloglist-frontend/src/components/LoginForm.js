import { useState } from 'react'
//import PropTypes from 'prop-types'
import { useUserDispatch } from '../UserContext'
import loginService from '../services/login'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonStyled } from './Navigation'

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &.h1,
  &.h2,
  &.h3 {
    text-align: center;
  }
`

export const FormButton = styled(ButtonStyled)`
  background: green;
  margin: 15px 0;
  width: 100%;
  color: white;
`
export const InputWrapper = styled.div`
  display: flex;
`
export const StyledInput = styled.input`
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2);
  background-color: white;
  line-height: 1.5;
  margin: 5px;
  &:hover,
  &:focus {
    box-shadow: 0 0px 1px hsla(0, 0%, 0%, 0.6), 0 1px 2px hsla(0, 0%, 0%, 0.2);
  }
`

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
    <Wrapper>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <InputWrapper>
          <StyledInput
            id="username"
            type="text"
            value={username}
            name="Username"
            placeholder="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <StyledInput
            id="password"
            type="password"
            value={password}
            name="Password"
            placeholder="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </InputWrapper>
        <FormButton id="login-button" type="submit">
          login
        </FormButton>
      </form>
    </Wrapper>
  )
}

/* LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
} */

export default LoginForm
