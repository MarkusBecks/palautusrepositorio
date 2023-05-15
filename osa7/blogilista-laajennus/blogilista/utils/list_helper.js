const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  const reducer = (acc, blog) => {
    if (blog.likes > acc.likes) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      }
    }
    return acc
  }
  return blogs.reduce(reducer, {
    likes: -1, //make sure at least a blog with 0 likes is returned
  })
}

const mostBlogs = blogs => {
  const authors = {}
  blogs.forEach(blog => {
    if (blog.author in authors) {
      authors[blog.author].blogs += 1
    } else {
      authors[blog.author] = { author: blog.author, blogs: 1 }
    }
  })
  const reducer = (acc, author) => {
    if (author.blogs > acc.blogs) {
      return {
        author: author.author,
        blogs: author.blogs,
      }
    }
    return acc
  }
  return Object.values(authors).reduce(reducer, { author: '', blogs: 0 })
}

const mostLikes = blogs => {
  const likesArr = {}
  blogs.forEach(blog => {
    if (blog.author in likesArr) {
      likesArr[blog.author].likes += blog.likes
    } else {
      likesArr[blog.author] = { author: blog.author, likes: blog.likes }
    }
  })
  const reducer = (acc, author) => {
    if (author.likes > acc.likes) {
      return author
    }
    return acc
  }
  return Object.values(likesArr).reduce(reducer, { author: '', likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
