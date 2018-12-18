const APIError = require('../utils/APIError');

const requireApiKey = () => (req, res, next) => {
  const apiKey = process.env.APIKEY;
  if (apiKey !== req.body.apiKey) {
    return next(new APIError('UNAUTHORIZED'));
  }
  return next();
};

module.exports = requireApiKey;
