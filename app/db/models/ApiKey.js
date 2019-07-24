const mongoose = require('mongoose');
const uuid = require('uuid/v4');
import db from '../';

const { Schema } = mongoose;

const apiKeySchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  key: {
    type: String,
    require: false,
    unique: true,
    default: () => uuid(),
  },
});

apiKeySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const ApiKey = db.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
