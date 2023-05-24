import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'

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

  const blogStyle = {
    padding: 5,
    margin: '5px 0',
    border: '1px solid black',
  }

  return (
    <div>
      <h2>Blog list</h2>
      {sortedBlogs.length > 0 ? (
        sortedBlogs.map(blog => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </div>
        ))
      ) : (
        <div>No blogs to show yet.</div>
      )}
    </div>
  )
}

export default BlogList
