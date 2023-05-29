import blogService from '../services/blogs'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useNotificationDispatch } from '../NotificationContext'
import { useState } from 'react'
import { StyledInput, InputWrapper } from './LoginForm'
import { ButtonStyled } from './Navigation'
import styled from 'styled-components'

export const CommentButton = styled(ButtonStyled)`
  margin: 0;
  background: green;
  color: white;
  box-shadow: 0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2);
`
const CommentInput = styled(StyledInput)`
  margin: 0 10px;
`
const CommentsContainer = styled.div`
  margin: 15px;
`

const BlogComments = () => {
  const [comment, setComment] = useState('')
  const { id } = useParams()
  const showNotification = useNotificationDispatch()
  const queryClient = useQueryClient()

  const blog = useQuery({
    queryKey: ['blogs', 'getBlog', id],
    queryFn: () => blogService.get(id),
    refetchOnWindowFocus: false,
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
        <InputWrapper>
          <CommentInput
            id="comment"
            type="text"
            value={comment}
            name="Comment"
            placeholder="Comment"
            onChange={({ target }) => setComment(target.value)}
          />
          <CommentButton type="submit">
            {addCommentMutation.isLoading ? 'Adding...' : 'Add comment'}
          </CommentButton>
        </InputWrapper>
      </form>
      <CommentsContainer>
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment.content}</li>
            ))}
          </ul>
        ) : (
          <CommentsContainer>No comments to show yet.</CommentsContainer>
        )}
      </CommentsContainer>
    </>
  )
}

export default BlogComments
