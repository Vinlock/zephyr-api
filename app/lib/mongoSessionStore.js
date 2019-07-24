const mongoDbStore = require('connect-mongodb-session');

const {
  APP_MONGO_HOST,
  APP_MONGO_SESSION_STORE_COLLECTION,
  APP_MONGO_DATABASE_NAME,
} = process.env;

const store = (session) => {
  const SessionStore = mongoDbStore(session);
  return new SessionStore({
    uri: APP_MONGO_HOST,
    databaseName: APP_MONGO_DATABASE_NAME,
    collection: APP_MONGO_SESSION_STORE_COLLECTION,
  });
};

module.exports = store;
