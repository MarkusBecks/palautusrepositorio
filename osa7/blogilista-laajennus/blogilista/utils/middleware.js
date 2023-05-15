const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('Status code:', res.statusCode)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  console.log('enter tokenExtractor')
  const getTokenFrom = req => {
    const auth = req.get('authorization')
    console.log('auth: ', auth)
    console.log('headers: ', req.headers)
    if (auth && auth.startsWith('Bearer ')) {
      return auth.replace('Bearer ', '')
    }
    return null
  }

  const token = getTokenFrom(req)
  req.token = token
  console.log('tokenExtractor req.token: ', req.token)

  next()
}

const userExtractor = async (req, res, next) => {
  console.log('enter user extractor')
  const token = req.token
  console.log('userExtractor token: ', token)
  if (!token) {
    return res.status(401).json({ error: 'missing token' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log('decodedToken: ', decodedToken)
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'invalid token' })
  }

  req.user = user
  console.log('userExtractor req.user: ', req.user)
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
