const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const DiscordConnection = require('../../../db/models/DiscordConnection');
const JWT = require('jsonwebtoken');
const axios = require('axios');
// const addGuildMember = require('../../../lib/discord/addGuildMember');
const getGuildMember = require('../../../lib/discord/getGuildMember');
const { roles } = require('../../../lib/discord/data')

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_CALLBACK_URL,
  DISCORD_REDIRECT_URL,
  JWT_SECRET,
} = process.env;

const scopes = ['identify', 'email', 'guilds.join'];

const client = new OAuth2Strategy({
  authorizationURL: 'https://discordapp.com/api/oauth2/authorize',
  tokenURL: 'https://discordapp.com/api/oauth2/token',
  clientID: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  callbackURL: DISCORD_CALLBACK_URL,
  scope: scopes
}, function(accessToken, refreshToken, profile, done) {
  if (!profile.verified) {
    done(new Error('UNVERIFIED'), null);
  } else {
    getGuildMember(profile.id)
      .then(function (member) {
        if (member.roles.includes(roles.legion)) {
          // addGuildMember(accessToken, profile.id);
          DiscordConnection.userFromDiscord(profile, accessToken, refreshToken)
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              done(err, null);
            });
        }
      }).catch(function () {
        done(new Error('NOT_LEGION'), null);
      });
  }
});

client.userProfile = (accessToken, done) => {
  axios('https://discordapp.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.data)
    .then(data => done(null, data))
    .catch(err => done(err, null));
};

const strategy = () => {
  passport.use('discord', client);
};

const auth = () => [
  passport.authenticate('discord', {
    scope: scopes
  }),
];

const authInvite = () => [
  (req, res, next) => {
    const { invite } = req.params;
    req.session.invite = invite;
    req.session.save();
    console.log('authInvite', req.session.invite);
    return next();
  },
  passport.authenticate('discord', {
    scope: scopes
  }),
];

const callback = () => [
  (req, res, next) => passport.authenticate('discord', (err, user, info) => {
    if (err) {
      res.cookie('zjwt', null);
      res.redirect(`${DISCORD_REDIRECT_URL}?error=${err.message}`);
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next),
  async (req, res) => {
    const token = JWT.sign({
      id: req.user._id,
    }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('zjwt', token, {
      maxAge: 604800000,
    });

    if (req.user.new) {
      req.user.new = false;
      req.user.save(() => {
        res.redirect(`${DISCORD_REDIRECT_URL}?success=JOINED`);
      });
    } else {
      res.redirect(DISCORD_REDIRECT_URL);
    }
  },
];

module.exports = {
  strategy,
  auth,
  authInvite,
  callback,
};
