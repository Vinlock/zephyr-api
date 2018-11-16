const APIError = require('../utils/APIError');

const requireApiKey = () => (req, res, next) => {
  const apiKey = process.env.APIKEY;
  if (apiKey !== req.body.apiKey) {
    next(new APIError('UNAUTHORIZED'));
  }
  next();
};

module.exports = requireApiKey;
