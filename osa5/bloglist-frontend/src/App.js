import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs'
import loginService from './services/login';
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
      .catch(error => {
        console.log(error);
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService
        .login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMsg(`Welcome, ${username}!`)
    } catch (error) {
      setErrorMsg(error.response.data.error);
    }
  }

  const addBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setSuccessMsg(`Blog ${returnedBlog.title} by ${returnedBlog.author} added!`)
      })
      .catch(error => {
        setErrorMsg(error.response.data.error);
      })
  }

  const handleLogout = (username) => {
    window.localStorage.removeItem('loggedBloglistUser')
    setSuccessMsg(`See you soon again, ${username}`)
    setUser(null)
  }

  return (
    <div>
      <Notification
        successMsg={successMsg} setSuccessMsg={setSuccessMsg}
        errorMsg={errorMsg} setErrorMsg={setErrorMsg}
      />
      {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
        :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={() => handleLogout(user.username)}>logout</button></p>
          <AddBlogForm
            addBlog={addBlog}
            title={title} setTitle={setTitle}
            author={author} setAuthor={setAuthor}
            url={url} setUrl={setUrl}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )

}

export default App