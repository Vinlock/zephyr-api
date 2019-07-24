const express = require('express');
const authRouter = require('./modules/auth');
const accountRouter = require('./modules/account');
const discordRouter = require('./modules/discord');
const testRouter = require('./modules/test');

const router = express.Router();

router.get('/test', (req, res) => res.json({success:true}));

router.use('/auth', authRouter);
router.use('/account', accountRouter);
router.use('/discord', discordRouter);
router.use('/tester', testRouter);

module.exports = router;
