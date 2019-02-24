const User = require('../db/models/User');
const JWT = require('jsonwebtoken');

const authorize = () => async (req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.headers, 'authorization')) {
    const split = req.headers.authorization.split(' ');
    const type = split[0];
    if (type === 'ZEP') {
      const token = split[1];
      let decoded = null;
      try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.jwt = decoded;
        req.user = await User.findById(decoded.id);
        req.logger.addMetadata('user', req.user);
        req.logger.log('user.authenticated', {
          success: true,
          user: req.user,
        });
        res.set('X-Authenticated', Buffer.from(JSON.stringify(req.user))
          .toString('base64'));
      } catch (err) {
        req.logger.log('user.authenticated', {
          success: false,
        });
        res.set('X-Authenticated', Buffer.from(JSON.stringify({
          no_auth: true,
        })).toString('base64'));
      }
    }
  }
  return next();
};

module.exports = authorize;