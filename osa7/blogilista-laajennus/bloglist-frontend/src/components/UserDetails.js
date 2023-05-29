import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { BlogContainer, BlogLink } from './BlogList'
import styled from 'styled-components'

const CenteredBlog = styled(BlogContainer)`
  justify-content: center;
`

const UserDetails = () => {
  const { id } = useParams()

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
      <h1>{user.name}</h1>
      {user.blogs.length > 0 ? (
        <div>
          <h2>Added blogs:</h2>
          {user.blogs.map(blog => (
            <CenteredBlog key={blog.id}>
              <BlogLink to={`/blogs/${blog.id}`}>{blog.title}</BlogLink>
            </CenteredBlog>
          ))}
        </div>
      ) : (
        <div>No blogs added yet.</div>
      )}
    </>
  )
}
export default UserDetails
