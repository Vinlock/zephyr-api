const mongoose = require('mongoose');

const {
  APP_MONGO_HOST,
  APP_MONGO_DATABASE_NAME,
} = process.env;

mongoose.set('useCreateIndex', true);
mongoose.connect(APP_MONGO_HOST, {
  useNewUrlParser: true,
  dbName: APP_MONGO_DATABASE_NAME,
});
