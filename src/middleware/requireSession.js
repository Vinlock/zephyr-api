const APIError = require('../utils/APIError');

const requireSession = () => (req, res, next) => {
  if (!req.user) {
    next(new APIError('INVALID_SESSION'));
  }
  next();
};

module.exports = requireSession;
