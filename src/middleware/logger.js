const Logger = require('../lib/logger');

const loggingMiddleware = () => (req, res, next) => {
  req.logger = new Logger();

  // On Complete
  res.on('finish', () => {
    req.logger.log('client.response', {
      body: res.body,
      headers: res.getHeaders(),
    });
  });

  return next();
};

module.exports = loggingMiddleware;
