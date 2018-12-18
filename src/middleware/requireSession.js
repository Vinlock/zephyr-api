const APIError = require('../utils/APIError');

const requireSession = () => (req, res, next) => {
  if (!req.user) {
    return next(new APIError('INVALID_SESSION'));
  }
  return next();
};

module.exports = requireSession;
