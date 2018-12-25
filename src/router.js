const express = require('express');
const authRouter = require('./modules/auth');
const accountRouter = require('./modules/account');
const discordRouter = require('./modules/discord');
const oauthController = require('./modules/discord/controllers/oauthController');

const router = express.Router();

router.get('/test', (req, res) => res.json({success:true}));

router.use('/auth', authRouter);
router.use('/account', accountRouter);
router.use('/discord', discordRouter);

module.exports = router;
