const mongoose = require('mongoose');
const DiscordClient = require('../../lib/discord/discordClient');
const { roles } = require('../../lib/discord/enums');
const UserProfile = require('./UserProfile');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  new: {
    type: Boolean,
    default: true,
  },
});

userSchema.virtual('discord', {
  ref: 'DiscordConnection',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

userSchema.virtual('profile', {
  ref: 'UserProfile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

userSchema.methods.isAdmin = function() {
  return this.populate('discord').execPopulate()
    .then(function (doc) {
      return doc.discord.id === process.env.DISCORD_ADMIN;
    });
};

userSchema.methods.isLegionMember = function() {
  return this.populate('discord').execPopulate()
    .then(function (doc) {
      const discord = new DiscordClient();
      return discord.getGuildMember(doc.discord.id)
        .then((member) => member.roles.includes(roles.legion))
        .catch(() => false);
    });
};

userSchema.post('save', function (doc, next) {
  UserProfile.findOne({ userId: doc._id })
    .then(function (foundProfile) {
      if (!foundProfile) {
        const profile = new UserProfile({
          userId: doc._id,
        });
        profile.save(() => next());
      }
      next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
