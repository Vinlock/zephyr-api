const { User, UserSession } = require('../db');
const jwt = require('../utils/jwt');

const authorize = () => async (req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.headers, 'authorization')) {
    const split = req.headers.authorization.split(' ');
    const type = split[0];
    if (type === 'PAD') {
      const token = split[1];
      let decoded = null;
      try {
        decoded = await jwt.verify(token);
        req.jwt = decoded;
        req.userSession = await UserSession.findById(decoded.sessionId);
        req.user = await User.findById(decoded.id);
        res.set('X-Authenticated', Buffer.from(JSON.stringify(req.user))
          .toString('base64'));
      } catch (err) {
        res.set('X-Authenticated', Buffer.from(JSON.stringify({
          no_auth: true,
        })).toString('base64'));
      }
    }
  }
  next();
};

module.exports = authorize;