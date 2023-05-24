import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const UserDetails = () => {
  const { id } = useParams()
  const bold = {
    fontWeight: 'bold',
  }

  const userQuery = useQuery({
    queryKey: ['users', 'getUser', id],
    queryFn: () => userService.get(id),
  })

  const { isInitialLoading, isError } = userQuery

  if (isInitialLoading) return <div>Loading user data...</div>
  if (isError) return <div>Service not available</div>

  const user = userQuery.data || {}

  console.log('userData:', user)
  console.log('userData.blogs:', user.blogs)

  return (
    <>
      <h2>{user.name}</h2>
      {user.blogs.length > 0 ? (
        <>
          <div style={bold}>Added blogs:</div>
          <ul>
            {user.blogs.map(blog => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <div>No blogs added yet.</div>
      )}
    </>
  )
}
export default UserDetails
