import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'
import { useNavigate } from 'react-router-dom'
import { StyledInput, InputWrapper, FormButton, Wrapper } from './LoginForm'

const AddBlogForm = ({ addBlogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const queryClient = useQueryClient()
  const showNotification = useNotificationDispatch()
  const navigate = useNavigate()

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: returnedBlog => {
      queryClient.invalidateQueries()
      showNotification(
        `Blog '${returnedBlog.title}' by ${returnedBlog.author} added!`,
        'success'
      )
      addBlogFormRef.current.toggleVisibility()
    },
    onError: error => {
      showNotification(error.response.data.error, 'error')
    },
  })

  const createBlog = event => {
    event.preventDefault()
    createBlogMutation.mutate({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/blogs')
  }

  return (
    <Wrapper>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <InputWrapper>
          <StyledInput
            id="title"
            type="text"
            value={title}
            name="Title"
            placeholder="title of the blog"
            onChange={({ target }) => setTitle(target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <StyledInput
            id="author"
            type="text"
            value={author}
            name="Author"
            placeholder="author of the blog"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <StyledInput
            id="url"
            type="text"
            value={url}
            name="Url"
            placeholder="url to the blog post"
            onChange={({ target }) => setUrl(target.value)}
          />
        </InputWrapper>
        <div>
          <FormButton
            id="create"
            type="submit"
            disabled={createBlogMutation.isLoading}
          >
            {createBlogMutation.isLoading ? 'Creating...' : 'create'}
          </FormButton>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddBlogForm
