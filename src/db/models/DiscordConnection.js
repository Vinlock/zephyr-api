const mongoose = require('mongoose');
const User = require('./User');

const { Schema } = mongoose;

const discordConnectionSchema = new Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  accessToken: {
    type: String,
    require: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    require: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    unique: true,
  },
});

discordConnectionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

discordConnectionSchema.statics = {
  userFromDiscord: function userFromDiscord(profile, accessToken, refreshToken) {
    const self = this;
    return new Promise(function (res, rej) {
      self.findOne({ id: profile.id }).populate('user').exec()
        .then(function (discordConnection) {
          if (discordConnection) {
            discordConnection.accessToken = accessToken;
            discordConnection.refreshToken = refreshToken;
            discordConnection.save()
              .then(function (doc) {
                doc.user.username = `${profile.username}#${profile.discriminator}`;
                doc.user.admin = profile.id === process.env.DISCORD_ADMIN;
                doc.user.save()
                  .then(function (doc) {
                    res(doc);
                  });
              });
          } else {
            const user = new User({
              username: `${profile.username}#${profile.discriminator}`,
              admin: profile.id === process.env.DISCORD_ADMIN,
            });
            user.save()
              .then(function (doc) {
                const discordConnection = new self({
                  id: profile.id,
                  accessToken, refreshToken,
                  userId: doc._id,
                });
                discordConnection.save()
                  .then(function (doc) {
                    doc.populate('user').execPopulate()
                      .then((doc) => {
                        res(doc.user);
                      });
                  });
              });
          }
        }).catch(err => rej(err));
    });
  }
};

const DiscordConnection = mongoose.model('DiscordConnection', discordConnectionSchema);

module.exports = DiscordConnection;