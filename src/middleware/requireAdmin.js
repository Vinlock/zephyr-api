const APIError = require('../utils/APIError');

const requireAdmin = () => (req, res, next) => {
  if (!req.user || !req.user.admin) {
    next(new APIError('UNAUTHORIZED'));
  }
  next();
};

module.exports = requireAdmin;
