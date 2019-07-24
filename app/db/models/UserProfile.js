const mongoose = require('mongoose');
import db from '../';

const { Schema } = mongoose;

const userProfileSchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    unique: true,
  },
  twitch: {
    type: String,
    require: false,
    unique: false,
    default: null,
  },
});

userProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const UserProfile = db.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
