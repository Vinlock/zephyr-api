const mongoDbStore = require('connect-mongodb-session');

const {
  APP_MONGO_HOST,
  APP_MONGO_SESSION_STORE_COLLECTION,
} = process.env;

const store = (session) => {
  const SessionStore = mongoDbStore(session);
  return new SessionStore({
    uri: APP_MONGO_HOST,
    collection: APP_MONGO_SESSION_STORE_COLLECTION,
  });
};

module.exports = store;
