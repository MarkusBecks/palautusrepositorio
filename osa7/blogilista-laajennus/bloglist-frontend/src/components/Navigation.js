import { Link } from 'react-router-dom'
import { useUserValue } from '../UserContext'

const Navigation = ({ handleLogout }) => {
  const { user } = useUserValue()

  const linkStyle = {
    padding: 5,
  }

  const navStyle = {
    background: 'wheat',
    padding: 10,
  }

  return (
    <div style={navStyle}>
      <Link style={linkStyle} to="/blogs">
        blogs
      </Link>
      <Link style={linkStyle} to="/users">
        users
      </Link>
      <em style={linkStyle}>{user.username} logged in</em>
      <button onClick={() => handleLogout(user)}>logout</button>
    </div>
  )
}

export default Navigation
