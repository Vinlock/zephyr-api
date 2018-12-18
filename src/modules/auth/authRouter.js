const express = require('express');
const userController = require('./controllers/userController');
const logoutController = require('./controllers/logoutController');
const authorizeMiddleware = require('../../middleware/authorize');

const authRouter = express.Router();

authRouter.use(authorizeMiddleware());

authRouter.get('/user', userController);
authRouter.post('/logout', logoutController);

module.exports = authRouter;
