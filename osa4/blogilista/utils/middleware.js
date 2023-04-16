const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const getTokenFrom = req => {
    const auth = req.get('authorization');
    if (auth && auth.startsWith('Bearer ')) {
      return auth.replace('Bearer ', '');
    }
    return null;
  };

  const token = getTokenFrom(req);
  req.token = token;
  console.log('req.token: ', req.token);

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or invalid' });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};