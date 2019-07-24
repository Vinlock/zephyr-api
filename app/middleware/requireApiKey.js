const APIError = require('../utils/APIError');

const { APP_API_KEY } = process.env;

const requireApiKey = () => (req, res, next) => {
  const apiKey = APP_API_KEY;
  if (apiKey !== req.body.apiKey) {
    return next(new APIError('UNAUTHORIZED'));
  }
  return next();
};

module.exports = requireApiKey;
