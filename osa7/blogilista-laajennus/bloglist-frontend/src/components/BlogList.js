import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const descendingLikes = (a, b) => b.likes - a.likes
  const sortedBlogs = [...blogs].sort(descendingLikes)

  const blogStyle = {
    padding: 5,
    margin: '5px 0',
    border: '1px solid black',
  }

  return (
    <div>
      {sortedBlogs.map(blog => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList
