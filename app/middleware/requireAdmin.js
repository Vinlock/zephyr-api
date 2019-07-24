const APIError = require('../utils/APIError');

const requireAdmin = () => (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return next(new APIError('UNAUTHORIZED'));
  }
  return next();
};

module.exports = requireAdmin;
