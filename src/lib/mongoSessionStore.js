const mongoDbStore = require('connect-mongodb-session');

const store = (session) => {
  const SessionStore = mongoDbStore(session);
  return new SessionStore({
    uri: process.env.SESSION_MONGO_URL,
    collection: 'sessions',
  });
};

module.exports = store;
