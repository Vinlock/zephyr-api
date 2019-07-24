const mongoose = require('mongoose');

const {
  APP_MONGO_HOST,
  APP_MONGO_DATABASE_NAME,
  APP_MONGO_REPLICA_SET,
} = process.env;

const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoReconnect: true,
  dbName: APP_MONGO_DATABASE_NAME,
};

const hasReplicaSet = Boolean(APP_MONGO_REPLICA_SET && APP_MONGO_REPLICA_SET.length > 0);
if (hasReplicaSet) {
  connectionOptions.replicaSet = APP_MONGO_REPLICA_SET;
}

mongoose.connect(APP_MONGO_HOST, connectionOptions);
