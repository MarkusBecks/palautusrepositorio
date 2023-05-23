import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'

const Users = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  }

  const userStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    width: '20%',
  }

  const headingStyle = {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
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
        <h2>Users</h2>
        <div style={headingStyle}>
          <div>Blogs Created</div>
        </div>
        {sortedUsers.map(user => (
          <div key={user.id} style={userStyle}>
            <div>{user.name}</div>
            <div>{user.blogs.length}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Users
