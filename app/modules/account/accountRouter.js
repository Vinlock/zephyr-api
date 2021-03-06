const express = require('express');
const accountController = require('./controllers/accountController');
const apiKeyController = require('./controllers/apiKeyController');
const authorizeMiddleware = require('../../middleware/authorize');
const requireSession = require('../../middleware/requireSession');

const accountRouter = express.Router();

accountRouter.use(authorizeMiddleware());
accountRouter.use(requireSession());

accountRouter.get('/profile', accountController.getProfile);
accountRouter.post('/profile/games/:game', accountController.updateProfileGame);
accountRouter.post('/profile/languages/:language', accountController.updateProfileLanguage);
accountRouter.post('/profile/twitch', accountController.updateTwitchStream);

accountRouter.put('/apikey', apiKeyController.create);

module.exports = accountRouter;
