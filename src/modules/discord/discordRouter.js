const express = require('express');
const oauthController = require('./controllers/oauthController');

const discordRouter = express.Router();

oauthController.strategy();

discordRouter.get('/oauth', oauthController.auth());

discordRouter.get('/oauth/callback', oauthController.callback());

discordRouter.get('/oauth/:invite', oauthController.authInvite());

module.exports = discordRouter;
