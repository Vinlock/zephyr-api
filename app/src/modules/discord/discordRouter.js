const express = require('express');
const oauthController = require('./controllers/oauthController');
const webhookController = require('./controllers/webhookController');

const discordRouter = express.Router();

oauthController.strategy();

discordRouter.get('/oauth', oauthController.auth());

discordRouter.get('/oauth/callback', oauthController.callback());

discordRouter.get('/oauth/:invite', oauthController.authInvite());

discordRouter.post('/webhook/sns', webhookController.sns());

discordRouter.post('/webhook/discord/:channel', webhookController.discord());

module.exports = discordRouter;
