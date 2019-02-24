const mongoose = require('mongoose');

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
  updateConnection: function updateConnection(currentAccessToken, currentRefreshToken, accessToken, refreshToken) {
    return this.find({
      accessToken: currentAccessToken,
      refreshToken: currentRefreshToken,
    }).then(function (connection) {
      connection.accessToken = accessToken;
      connection.refreshToken = refreshToken;
      return connection.save()
    });
  },
  userFromDiscord: function userFromDiscord(profile, member, accessToken, refreshToken) {
    const self = this;
    const User = this.model('User');
    return new Promise(function (res, rej) {
      self.findOne({ id: profile.id }).populate('user').exec()
        .then(function (discordConnection) {
          const name = member.nick || profile.username;
          if (discordConnection) {
            discordConnection.accessToken = accessToken;
            discordConnection.refreshToken = refreshToken;
            discordConnection.save()
              .then(function (doc) {
                doc.user.username = `${name}#${profile.discriminator}`;
                doc.user.admin = profile.id === process.env.DISCORD_ADMIN;
                doc.user.save()
                  .then(function (doc) {
                    res(doc);
                  });
              });
          } else {
            const user = new User({
              username: `${name}#${profile.discriminator}`,
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
