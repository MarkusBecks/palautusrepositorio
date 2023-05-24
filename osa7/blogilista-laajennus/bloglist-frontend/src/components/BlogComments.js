import blogService from '../services/blogs'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useNotificationDispatch } from '../NotificationContext'
import { useState } from 'react'

const BlogComments = () => {
  const [comment, setComment] = useState('')
  const { id } = useParams()
  const showNotification = useNotificationDispatch()
  const queryClient = useQueryClient()

  const blog = useQuery({
    queryKey: ['blogs', 'getBlog', id],
    queryFn: () => blogService.get(id),
  })

  const comments = blog.data ? blog.data.comments : []

  const addCommentMutation = useMutation({
    mutationFn: addedComment => {
      return blogService.postComment(addedComment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      showNotification(`Comment "${comment}" added!`, 'success')
      setComment('')
    },
    onError: error => {
      showNotification(error.response.data.error, 'error')
    },
  })

  const addComment = event => {
    event.preventDefault()
    const addedComment = {
      id,
      comment,
    }
    addCommentMutation.mutate(addedComment)
  }

  return (
    <>
      <h2>Blog comments</h2>
      <form onSubmit={addComment}>
        <div>
          <input
            id="comment"
            type="text"
            value={comment}
            name="Comment"
            placeholder="Comment"
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">
            {addCommentMutation.isLoading ? 'Adding...' : 'Add comment'}
          </button>
        </div>
      </form>
      <div>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment.content}</li>
            ))}
          </ul>
        ) : (
          <div>No comments to show yet.</div>
        )}
      </div>
    </>
  )
}

export default BlogComments
