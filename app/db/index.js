/*
 * MIT License
 *
 * Copyright (c) 2019 Dak Washbrook
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import mongoose from 'mongoose';

const {
  APP_MONGO_HOST,
  APP_MONGO_USERNAME,
  APP_MONGO_PASSWORD,
  APP_MONGO_REPLICA_SET,
} = process.env;

const createMongo = (database) => {
  // eslint-disable-next-line
  const connectionString = APP_MONGO_HOST;
  const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: database,
    autoReconnect: true,
  };
  const hasUsername = Boolean(APP_MONGO_USERNAME && APP_MONGO_USERNAME.length > 0);
  const hasPassword = Boolean(APP_MONGO_PASSWORD && APP_MONGO_PASSWORD.length > 0);
  if (hasUsername && hasPassword) {
    connectionOptions.user = APP_MONGO_USERNAME;
    connectionOptions.pass = APP_MONGO_PASSWORD;
  }

  const hasReplicaSet = Boolean(APP_MONGO_REPLICA_SET && APP_MONGO_REPLICA_SET.length > 0);
  if (hasReplicaSet) {
    connectionOptions.replicaSet = APP_MONGO_REPLICA_SET;
  }

  return mongoose.createConnection(connectionString, connectionOptions);
};

export default createMongo;
