import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const AddBlogForm = ({ addBlogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const queryClient = useQueryClient()
  const showNotification = useNotificationDispatch()

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
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            placeholder="title of the blog"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            placeholder="author of the blog"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            placeholder="url to the blog post"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <button
            id="create"
            type="submit"
            disabled={createBlogMutation.isLoading}
          >
            {createBlogMutation.isLoading ? 'Creating...' : 'create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBlogForm
