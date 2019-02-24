const APIError = require('../utils/APIError');

const requireSession = () => (req, res, next) => {
  if (!req.user) {
    const error = new APIError('INVALID_SESSION');
    error.statusCode = 403;
    return next(error);
  }
  return next();
};

module.exports = requireSession;
