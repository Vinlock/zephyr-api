const UserSession = require('../db/models/UserSession');
const moment = require('moment');
const jwt = require('./JWT');

const jwtKeyArn = process.env.JWT_KEY_ARN;

class SessionManager {
  createSession = async (user, keepalive = false) => {
    let sessionExpire = keepalive ?
      moment().add(1, 'year') : moment().add(7, 'days');
    sessionExpire = sessionExpire.toDate();

    const session = new UserSession({
      userId: user.id,
      expires: sessionExpire,
    });
    await session.save();

    return await jwt.sign({
      id: user.id,
      sessionId: session._id,
    }, {
      expires: sessionExpire,
    }, jwtKeyArn);
  };
}

module.exports = SessionManager;
