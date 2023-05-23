import blogService from '../services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useUserValue } from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'

const BlogDetails = () => {
  const { id } = useParams()
  const { user } = useUserValue()
  const queryClient = useQueryClient()
  const showNotification = useNotificationDispatch()
  const navigate = useNavigate()
  console.log('blogId:', id)

  const blogQuery = useQuery({
    queryKey: ['blogs', 'getBlog', id],
    queryFn: () => blogService.get(id),
  })

  const blog = blogQuery.data || {}

  const updateBlogMutation = useMutation({
    mutationFn: updateData => {
      return blogService.update(updateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      console.log('Update successful')
    },
    onError: error => {
      showNotification(error.response.data.error, 'error')
    },
  })

  const handleLike = blog => {
    console.log('handleLike blog:', blog)
    const updatedBlog = {
      id: blog.id,
      newObject: {
        ...blog,
        likes: blog.likes + 1,
      },
    }
    console.log('handleLike updatedBlog:', updatedBlog)
    updateBlogMutation.mutate(updatedBlog)
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.destroy,
    onSuccess: () => {
      queryClient.invalidateQueries()
      showNotification(
        `Blog '${blog.title}' by ${blog.author} deleted.`,
        'success'
      )
    },
    onError: error => {
      showNotification(
        `Error deleting blog '${blog.title}': ${error.response.data.error}`,
        'error'
      )
    },
  })

  const handleDelete = id => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      deleteBlogMutation.mutate(id)
    }
  }

  const isAuthorized =
    user && blog && blog.user && blog.user.username === user.username

  const username =
    blog.user && blog.user.username ? blog.user.username : 'anonymous'

  if (blogQuery.isInitialLoading) return <div>Loading blog details...</div>
  if (blogQuery.isError) return <div>Service not available</div>
  if (!blog.id) {
    navigate('/blogs') // Navigate to blogs list if the blog is not found
    return null
  }

  return (
    <>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div className="likes">
        likes {blog.likes}
        <button
          disabled={updateBlogMutation.isLoading}
          onClick={() => handleLike(blog)}
          className="likesButton"
        >
          {updateBlogMutation.isLoading ? 'Updating...' : 'like'}
        </button>
      </div>
      <div>{blog.url}</div>
      <div>added by {username}</div>
      {isAuthorized && (
        <div>
          <button onClick={() => handleDelete(blog.id)}>remove blog</button>
        </div>
      )}
    </>
  )
}

export default BlogDetails
