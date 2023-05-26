import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const UserLink = styled(Link)`
  color: black;
  text-decoration: none;
  &:hover {
    color: #00d4ff;
    text-decoration: underline;
  }
`

export const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 1px;
  min-width: 300px;
  font-size: 20px;
  &:nth-of-type(odd) {
    background: whitesmoke;
  }
  &:nth-of-type(odd):hover {
    background: white;
  }
  &:nth-of-type(even):hover {
    background: whitesmoke;
  }
`

const Users = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  }

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isInitialLoading) return <div>Loading users...</div>
  if (usersQuery.isError) return <div>Service not available</div>

  const user = usersQuery.data

  const sortedUsers = [...user].sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <>
      <div className="Users-container" style={containerStyle}>
        <h1>Users</h1>
        <h2>Blogs Created</h2>
        {sortedUsers.map(user => (
          <UserContainer key={user.id}>
            <UserLink to={`/users/${user.id}`}>{user.name}</UserLink>
            <div>{user.blogs.length}</div>
          </UserContainer>
        ))}
      </div>
    </>
  )
}

export default Users
