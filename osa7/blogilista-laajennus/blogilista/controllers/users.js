const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'password needs to be at least 3 characters long!' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })

  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })
  if (user) {
    res.json(user)
    console.log('backend user:', user)
  } else {
    res.status(404).end()
  }
})

module.exports = usersRouter
