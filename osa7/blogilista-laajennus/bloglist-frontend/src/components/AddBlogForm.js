import { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = ({ addBlog, buttonLabel }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const createBlog = event => {
    event.preventDefault()
    addBlog({
      title: title,
      author: author,
      url: url,
    })
    resetForm()
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
          <button id="create" type="submit">
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
}

export default AddBlogForm
