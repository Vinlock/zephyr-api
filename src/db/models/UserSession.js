const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSessionSchema = new Schema({
  userId: {
    type: ObjectId,
    require: true,
    index: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

userSessionSchema.static = {
  findById(_id) {
    return this.findOne({ _id });
  },
  deleteSession(_id) {
    return this.findOne({ _id }).remove();
  },
};

userSessionSchema.index({
  expires: 1,
}, {
  expireAfterSeconds: 0,
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
