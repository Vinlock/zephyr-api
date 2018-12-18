const mongoDbStore = require('connect-mongodb-session');

const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || 27017;
const db = process.env.MONGO_DATABASE || 'sessionstore';
const uri = `mongodb://${host}:${port}/${db}`;

const store = (session) => {
  const SessionStore = mongoDbStore(session);
  return new SessionStore({
    uri, collection: 'sessions',
  });
};

module.exports = store;
