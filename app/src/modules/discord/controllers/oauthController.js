const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const DiscordConnection = require('../../../db/models/DiscordConnection');
const JWT = require('jsonwebtoken');
const axios = require('axios');
const DiscordClient = require('../../../lib/discord/discordClient');
const { roles } = require('../../../lib/discord/enums');

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URL,
  DISCORD_CALLBACK_URL,
  JWT_SECRET,
  COOKIE_DOMAIN,
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
    const run = async function () {
      const discord = new DiscordClient();
      let member = null;
      try {
        member = await discord.getGuildMember(profile.id);
      } catch (err) {
        await discord.addGuildMember(accessToken, profile.id);
        await discord.addRoleToUser(profile.id, roles.communityMember);
        member = await discord.getGuildMember(profile.id);
      }
      try {
        const user = await DiscordConnection.userFromDiscord(profile, member, accessToken, refreshToken);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    };
    run().catch(function (err) {
      done(err, null);
    });
  }
});

client.userProfile = (accessToken, done) => {
  axios('https://discordapp.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(response => response.data)
    .then((data) => {
      return data;
    })
    .then(data => done(null, data))
    .catch(err => done(err, null));
};

const strategy = () => {
  passport.use('discord', client);
};

const auth = () => [
  (req, res, next) => {
    req.session.oauth_redirect = req.query.redirect_url || DISCORD_REDIRECT_URL;
    req.session.save();
    return next();
  },
  passport.authenticate('discord', {
    scope: scopes
  }),
];

const authInvite = () => [
  (req, res, next) => {
    const { invite } = req.params;
    req.session.invite = invite;
    req.session.save();
    req.logger.log('discord.authInvite', {
      invite: req.session.invite,
    });
    return next();
  },
  passport.authenticate('discord', {
    scope: scopes
  }),
];

const callback = () => [
  (req, res, next) => passport.authenticate('discord', (err, user, info) => {
    if (err) {
      console.error('discord.error', err);
      let errorMessage = null;
      switch (err.message) {
        case 'MEMBER_NOT_FOUND':
          errorMessage = 'NOT_LEGION';
          break;
        case 'UNVERIFIED':
          errorMessage = err.message``;
          break;
        default:
          errorMessage = 'INTERNAL_ERROR';
          break;
      }
      req.logger.error('discord.oauth.error', {
        error: err.message,
        stacktrace: err.stack,
        filename: err.filename,
        lineNumber: err.lineNumber,
        name: err.name,
        columnNumber: err.columnNumber,
        toString: err.toString(),
      });
        res.redirect(`${req.session.oauth_redirect}?error=${errorMessage}`);
    } else {
      req.logger.error('discord.oauth.user', { user });
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

    const cookieOptions = {
      maxAge: 604800000,
      domain: COOKIE_DOMAIN,
    };

    req.logger.log('discord.token', { token });
    res.cookie('zjwt_token', token, cookieOptions);

    if (req.user.new) {
      req.user.new = false;
      req.user.save(() => {
        const redirectUrl = `${req.session.oauth_redirect}?success=JOINED`;
        req.logger.log('discord.oauth.success', {
          redirectUrl,
          new: req.user.new,
        });
        res.redirect(redirectUrl);
      });
    } else {
      const redirectUrl = req.session.oauth_redirect;
      req.logger.log('discord.oauth.success', {
        redirectUrl,
        new: req.user.new,
      });
      res.redirect(redirectUrl);
    }
  },
];

module.exports = {
  strategy,
  auth,
  authInvite,
  callback,
};
