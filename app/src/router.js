const express = require('express');
const authRouter = require('./modules/auth/index');
const accountRouter = require('./modules/account/index');
const discordRouter = require('./modules/discord/index');
const testRouter = require('./modules/test/index');

const router = express.Router();

router.get('/test', (req, res) => res.json({success:true}));

router.use('/auth', authRouter);
router.use('/account', accountRouter);
router.use('/discord', discordRouter);
router.use('/tester', testRouter);

module.exports = router;
