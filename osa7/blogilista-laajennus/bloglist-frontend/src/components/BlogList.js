import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import styled from 'styled-components'
import { Wrapper } from './LoginForm'
import { UserContainer, UserLink } from './Users'

export const BlogContainer = styled(UserContainer)`
  flex-wrap: wrap;
  width: min-content;
`
export const BlogLink = styled(UserLink)`
  font-size: 16px;
`

const BlogList = () => {
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (blogsQuery.isInitialLoading) return <div>Loading data...</div>
  if (blogsQuery.isError) return <div>Service not available</div>

  const blogs = blogsQuery.data || {}

  const descendingLikes = (a, b) => b.likes - a.likes
  const sortedBlogs = [...blogs].sort(descendingLikes)

  return (
    <Wrapper>
      <h1>Blog list</h1>
      {sortedBlogs.length > 0 ? (
        sortedBlogs.map(blog => (
          <BlogContainer key={blog.id}>
            <BlogLink to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </BlogLink>
          </BlogContainer>
        ))
      ) : (
        <div>No blogs to show yet.</div>
      )}
    </Wrapper>
  )
}

export default BlogList
