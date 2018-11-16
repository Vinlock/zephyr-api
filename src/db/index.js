const mongoose = require('mongoose');
const User = require('./models/User');
const UserSession = require('./models/UserSession');

const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || 27017;
const db = process.env.MONGO_DATABASE || 'zephyr';
const uri = `mongodb://${host}:${port}/${db}`;
mongoose.set('useCreateIndex', true);
mongoose.connect(uri, {
  useNewUrlParser: true,
});

module.exports = {
  User,
  UserSession,
};
