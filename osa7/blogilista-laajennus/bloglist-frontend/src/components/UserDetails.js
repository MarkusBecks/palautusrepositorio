import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const UserDetails = () => {
  const { userId } = useParams()

  const userQuery = useQuery({
    queryKey: ['users', 'getUser', userId],
    queryFn: userService.get(userId),
  })

  if (userQuery.isInitialLoading) return <div>Loading users...</div>
  if (userQuery.isError) return <div>Service not available</div>

  const user = userQuery.data

  console.log('userData:', user)
  console.log('userData.blogs:', user.blogs)

  return (
    <>
      <h2>{user.name}</h2>
      <div>added blogs</div>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default UserDetails
