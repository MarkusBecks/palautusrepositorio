import blogService from '../services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUserValue } from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'
import styled from 'styled-components'
import { CommentButton } from './BlogComments'

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  min-width: 300px;
  padding: 10px;
  margin: 1px;
  border: 1px solid black;
  border-radius: 5px;
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

const BlogButton = styled(CommentButton)`
  font-size: 14px;
  padding: 5px 20px;
`

const BlogDetails = () => {
  const { id } = useParams()
  const { user } = useUserValue()
  const queryClient = useQueryClient()
  const showNotification = useNotificationDispatch()
  const navigate = useNavigate()

  const blogQuery = useQuery({
    queryKey: ['blogs', 'getBlog', id],
    queryFn: () => blogService.get(id),
    refetchOnWindowFocus: false,
    onError: error => {
      console.error('Failed to fetch blog details:', error)
    },
  })

  const blog = blogQuery.data || {}
  console.log('blog:', blog)

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
      showNotification(
        `Blog '${blog.title}' by ${blog.author} deleted.`,
        'success'
      )
      navigate('/blogs')
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
      <FlexContainer>
        <div>URL:</div>
        <div>
          <Link to={blog.url}>{blog.url}</Link>
        </div>
      </FlexContainer>
      <FlexContainer>
        <div>likes: {blog.likes}</div>
        <BlogButton
          disabled={updateBlogMutation.isLoading}
          onClick={() => handleLike(blog)}
          className="likesButton"
        >
          {updateBlogMutation.isLoading ? 'Updating...' : 'like'}
        </BlogButton>
      </FlexContainer>
      <FlexContainer>
        <div>added by {username}</div>
        {isAuthorized && (
          <div>
            <BlogButton onClick={() => handleDelete(blog.id)}>
              remove blog
            </BlogButton>
          </div>
        )}
      </FlexContainer>
    </>
  )
}

export default BlogDetails
