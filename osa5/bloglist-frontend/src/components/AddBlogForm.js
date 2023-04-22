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

  const createBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: title,
      author: author,
      url: url
    })
    resetForm()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
          <input type='text' value={title} name='Title'
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input type='text' value={author} name='Author'
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input type='text' value={url} name='Url'
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <div>
          <button type='submit'>{buttonLabel}</button>
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